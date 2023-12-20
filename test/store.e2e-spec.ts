import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { productMock } from '../src/product/mock-dto/product.mock';
import { RoleName } from '../src/role/schema/role.schema';
import { createStoreMock, createStoreMock2 } from '../src/store/mock-dto/store.mock';
import { StoreController } from '../src/store/store.controller';
import { createUserMock, createUserMock2 } from '../src/user/mock-dto/user.mock';

describe('Store Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: StoreController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let accessTokenUser: string;
  let accessTokenSeller: string;
  let accessTokenAdmin: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userId: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let sellerId: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let storeId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<StoreController>(StoreController);
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  beforeEach(async () => {}, 10000);

  it('Notification controller should be defined', () => {
    expect(controller).toBeDefined();
  }, 10000);

  describe('Login', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      await dbConnection.collection('stores').deleteMany({});
      await dbConnection.collection('products').deleteMany({});
      await dbConnection.collection('users').deleteMany({});

      const newUser = await dbConnection.collection('users').insertOne(createUserMock());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser.insertedId.toString() } });

      const createStoreData = createStoreMock();
      createStoreData.userId = newUser.insertedId.toString();
      const newStore = await dbConnection.collection('stores').insertOne(createStoreData);
      await dbConnection.collection('roles').updateOne({ name: RoleName.SELLER }, { $push: { listUser: newUser.insertedId.toString() } });

      await dbConnection.collection('products').insertOne({ ...productMock(), storeId: newStore.insertedId.toString() });

      sellerId = newUser.insertedId.toString();
      storeId = newStore.insertedId.toString();

      const newUser2 = await dbConnection.collection('users').insertOne(createUserMock2());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser2.insertedId.toString() } });

      userId = newUser2.insertedId.toString();

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthang730@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenUser = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);
  });

  describe('Create store successfully', () => {
    it('POST /store/user should create a store successfully', async () => {
      const URL = `/store/user`;

      const createStoreData = createStoreMock2();

      const response = await request(httpServer).post(URL).send(createStoreData).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Tạo cửa hàng thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('Create store failure with already exist', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenSeller = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);

    it('POST /store/user should failure with already exist', async () => {
      const URL = `/store/user`;

      const createStoreData = createStoreMock2();

      const response = await request(httpServer).post(URL).send(createStoreData).set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.body.status).toBe(409);
      expect(response.body.message).toEqual('Người dùng này đã có cửa hàng!');
    }, 10000);
  });

  describe('Get my store successfully', () => {
    it('GET /store/seller should return info store successfully', async () => {
      const URL = `/store/seller`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy thông tin cửa hàng thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('Get store paging by admin successfully', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      const newAdmin = await dbConnection.collection('users').insertOne({
        email: 'admin@gmail.com',
        password: '$2b$10$9MjWWmmb9oP4Owr6grbKrefGc9JY4SsCwE94D8JoC6khnuIqnk05i',
      });
      await dbConnection.collection('roles').updateOne({ name: RoleName.ADMIN }, { $push: { listUser: newAdmin.insertedId.toString() } });

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'admin@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenAdmin = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);

    it('GET /store/admin?page=1&limit=2&search= should return list store paging by admin successfully', async () => {
      const URL = `/store/admin?page=1&limit=2`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách cửa hàng thành công!');
      expect(response.body.metadata.data).toHaveProperty('total');
      expect(response.body.metadata.data).toHaveProperty('stores');
    }, 10000);
  });

  describe('Get reputation store successfully', () => {
    it('GET /store-reputation?storeId=&userId= should return info reputation store successfully', async () => {
      const URL = `/store-reputation?storeId=${storeId}`;

      const response = await request(httpServer).get(URL);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy thông tin độ uy tín cửa hàng thành công!');
      expect(response.body.metadata).toHaveProperty('averageStar');
      expect(response.body.metadata).toHaveProperty('totalFeedback');
      expect(response.body.metadata).toHaveProperty('totalFollow');
      expect(response.body.metadata).toHaveProperty('isFollow');
    }, 10000);
  });

  describe('Get List Store Have Most Products Successfully', () => {
    it('GET store/admin/stores-most-products?limit=2 should return list store have most products successfully', async () => {
      const URL = `/store/admin/stores-most-products?limit=2`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenAdmin}`);

      console.log(response.body);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy thông tin danh sách cửa hàng có nhiều sản phẩm nhất thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('Get Store By Id Admin Successfully', () => {
    it('GET store/admin/:id should return detail information successfully', async () => {
      const URL = `/store/admin/${storeId}`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy thông tin cửa hàng thành công!');
      expect(response.body.metadata).toHaveProperty('store');
      expect(response.body.metadata).toHaveProperty('averageStar');
      expect(response.body.metadata).toHaveProperty('totalFeedback');
      expect(response.body.metadata).toHaveProperty('totalFollow');
      expect(response.body.metadata).toHaveProperty('totalRevenue');
      expect(response.body.metadata).toHaveProperty('totalDelivered');
    }, 10000);
  });

  describe('Update Store By Seller Successfully', () => {
    it('PUT /store/seller should update store information successfully', async () => {
      const URL = `/store/seller`;

      const response = await request(httpServer).put(URL).send(createStoreMock2()).set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Cập nhật thông tin cửa hàng thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });
});
