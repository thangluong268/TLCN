import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { FeedbackController } from '../src/feedback/feedback.controller';
import { createProductMock } from '../src/product/mock-dto/product.mock';
import { RoleName } from '../src/role/schema/role.schema';
import { createStoreMock } from '../src/store/mock-dto/store.mock';
import { createUserMock, createUserMock2 } from '../src/user/mock-dto/user.mock';

describe('Feedback Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: FeedbackController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let accessTokenUser: string;
  let accessTokenUserOther: string;
  let productId: string;
  let userId_1: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userId_2: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<FeedbackController>(FeedbackController);
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  beforeEach(async () => {}, 10000);

  it('Feedback controller should be defined', () => {
    expect(controller).toBeDefined();
  }, 10000);

  describe('Login', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      await dbConnection.collection('users').deleteMany({});

      const newUser2 = await dbConnection.collection('users').insertOne(createUserMock());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser2.insertedId.toString() } });

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenUser = response.body.metadata.data.stsTokenManager.accessToken;
      userId_1 = newUser2.insertedId.toString();
    }, 10000);
  });

  describe('Create feedback successfully', () => {
    it('POST /feedback/user?productId= should create a feedback successfully', async () => {
      const newUser = await dbConnection.collection('users').insertOne(createUserMock2());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser.insertedId.toString() } });

      const createStoreData = createStoreMock();
      createStoreData.userId = newUser.insertedId.toString();
      const newStore = await dbConnection.collection('stores').insertOne(createStoreData);
      await dbConnection.collection('roles').updateOne({ name: RoleName.SELLER }, { $push: { listUser: newUser.insertedId.toString() } });

      const createProductMockData = createProductMock();
      createProductMockData.storeId = newStore.insertedId.toString();
      const newProduct = await dbConnection.collection('products').insertOne(createProductMockData);
      productId = newProduct.insertedId.toString();

      userId_2 = newUser.insertedId.toString();

      const URL = `/feedback/user?productId=${newProduct.insertedId.toString()}`;

      const response = await request(httpServer)
        .post(URL)
        .send({
          content: 'nice',
          star: 4,
        })
        .set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Đánh giá thành công!');
      expect(response.body.metadata.data).toHaveProperty('content');
      expect(response.body.metadata.data).toHaveProperty('star');
      expect(response.body.metadata.data).toHaveProperty('consensus');
      expect(response.body.metadata.data).toHaveProperty('_id');
      expect(response.body.metadata.data).toHaveProperty('userId');
      expect(response.body.metadata.data).toHaveProperty('productId');
    }, 10000);
  });

  describe('Get all feedback paging successfully', () => {
    it('GET /feedback should return list feedback successfully', async () => {
      const URL = `/feedback?page=1&limit=2`;

      const response = await request(httpServer).get(URL);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách đánh giá thành công!');
      expect(response.body.metadata).toHaveProperty('total');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('Get total feedback successfully', () => {
    it('GET /feedback-count-total?productId= should return total feedback successfully', async () => {
      const URL = `/feedback-count-total?productId=${productId}`;

      const response = await request(httpServer).get(URL);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy tổng số lượng đánh giá thành công!');
      expect(response.body.metadata).toHaveProperty('total');
    }, 10000);
  });

  describe('Get star of feedback successfully', () => {
    it('GET /feedback-star?productId= should return star feedback successfully', async () => {
      const URL = `/feedback-star?productId=${productId}`;

      const response = await request(httpServer).get(URL);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách đánh giá sao thành công!');
      expect(response.body.metadata).toHaveProperty('startPercent');
      expect(response.body.metadata).toHaveProperty('averageStar');
    }, 10000);
  });

  describe('Consensus feedback successfully', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthang730@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenUserOther = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);

    it('PUT /feedback-consensus should return star feedback successfully', async () => {
      const URL = `/feedback-consensus?userId=${userId_1}&productId=${productId}`;

      const response = await request(httpServer).put(URL).set('Authorization', `Bearer ${accessTokenUserOther}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Đồng thuận thành công!');
    }, 10000);
  });
});
