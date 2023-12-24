import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { EvaluationController } from '../src/evaluation/evaluation.controller';
import { createProductMock } from '../src/product/mock-dto/product.mock';
import { RoleName } from '../src/role/schema/role.schema';
import { createStoreMock } from '../src/store/mock-dto/store.mock';
import { createUserMock, createUserMock2 } from '../src/user/mock-dto/user.mock';
import { evaluationMock } from '../src/evaluation/mock-dto/evaluation.mock';

describe('Evaluation Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: EvaluationController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let accessTokenUser: string;
  let userId: string;
  let productId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<EvaluationController>(EvaluationController);
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  beforeEach(async () => {}, 10000);

  it('Evaluation controller should be defined', () => {
    expect(controller).toBeDefined();
  }, 10000);

  describe('Login', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      await dbConnection.collection('products').deleteMany({});
      await dbConnection.collection('evaluations').deleteMany({});
      await dbConnection.collection('stores').deleteMany({});
      await dbConnection.collection('users').deleteMany({});

      const newUser = await dbConnection.collection('users').insertOne(createUserMock());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser.insertedId.toString() } });

      userId = newUser.insertedId.toString();

      const newUser2 = await dbConnection.collection('users').insertOne(createUserMock2());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser2.insertedId.toString() } });

      const createStoreData = createStoreMock();
      createStoreData.userId = newUser2.insertedId.toString();
      const newStore = await dbConnection.collection('stores').insertOne(createStoreData);
      await dbConnection.collection('roles').updateOne({ name: RoleName.SELLER }, { $push: { listUser: newUser2.insertedId.toString() } });

      const createProductMockData = createProductMock();
      createProductMockData.storeId = newStore.insertedId.toString();
      const newProduct = await dbConnection.collection('products').insertOne(createProductMockData);

      productId = newProduct.insertedId.toString();

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenUser = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);
  });

  describe('Make or removed emoji successfully', () => {
    it('PUT /evaluation/user?productId= should make or removed emoji to product successfully', async () => {
      
      const createEvaluationData = evaluationMock();
      createEvaluationData.productId = productId;
      createEvaluationData.emojis[0].userId = userId;
      createEvaluationData.hadEvaluation[0].userId = userId;
      await dbConnection.collection('evaluations').insertOne(createEvaluationData);

      const URL = `/evaluation/user?productId=${productId}`;

      const response = await request(httpServer).put(URL).send({ name: 'Love' }).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Đánh giá thành công!');
    }, 10000);
  });

  describe('Get all evaluation successfully', () => {
    it('GET /evaluation?productId=&userId= should return total per evaluation successfully', async () => {
      const URL = `/evaluation?productId=${productId}&userId=${userId}`;

      const response = await request(httpServer).get(URL);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách đánh giá thành công!');
      expect(response.body.metadata.data).toHaveProperty('total');
      expect(response.body.metadata.data).toHaveProperty('haha');
      expect(response.body.metadata.data).toHaveProperty('love');
      expect(response.body.metadata.data).toHaveProperty('wow');
      expect(response.body.metadata.data).toHaveProperty('sad');
      expect(response.body.metadata.data).toHaveProperty('angry');
      expect(response.body.metadata.data).toHaveProperty('like');
      expect(response.body.metadata.data).toHaveProperty('isReaction');
      expect(response.body.metadata.data).toHaveProperty('isPurchased');
    }, 10000);
  });
});
