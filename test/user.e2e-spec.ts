import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { billMock } from '../src/bill/mock-dto/bill.mock';
import { createCartMock } from '../src/cart/mock-dto/cart.mock';
import { DatabaseService } from '../src/database/database.service';
import { createProductMock } from '../src/product/mock-dto/product.mock';
import { RoleName } from '../src/role/schema/role.schema';
import { createStoreMock } from '../src/store/mock-dto/store.mock';
import { createAdminMock, createUserMock, createUserMock2 } from '../src/user/mock-dto/user.mock';
import { UserController } from '../src/user/user.controller';

describe('User Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let accessTokenUser: string;
  let accessTokenAdmin: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userId: string;
  let sellerId: string;
  let storeId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<UserController>(UserController);
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  beforeEach(async () => {}, 10000);

  it('User controller should be defined', () => {
    expect(controller).toBeDefined();
  }, 10000);

  describe('Login', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      await dbConnection.collection('products').deleteMany({});
      await dbConnection.collection('carts').deleteMany({});
      await dbConnection.collection('stores').deleteMany({});
      await dbConnection.collection('bills').deleteMany({});
      await dbConnection.collection('users').deleteMany({});

      const newUser = await dbConnection.collection('users').insertOne(createUserMock());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser.insertedId.toString() } });

      userId = newUser.insertedId.toString();

      const newUser3 = await dbConnection.collection('users').insertOne(createAdminMock());
      await dbConnection.collection('roles').updateOne({ name: RoleName.ADMIN }, { $push: { listUser: newUser3.insertedId.toString() } });

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'admin@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenAdmin = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);
  });

  describe('Get list user have most purchased successfully', () => {
    it('GET /user/admin/users-most-bills?limit=2 should return list user have most purchased successfully', async () => {
      const newUser2 = await dbConnection.collection('users').insertOne(createUserMock2());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser2.insertedId.toString() } });

      sellerId = newUser2.insertedId.toString();

      const createStoreData = createStoreMock();
      createStoreData.userId = newUser2.insertedId.toString();
      const newStore = await dbConnection.collection('stores').insertOne(createStoreData);
      await dbConnection.collection('roles').updateOne({ name: RoleName.SELLER }, { $push: { listUser: newUser2.insertedId.toString() } });

      storeId = newStore.insertedId.toString();

      const createProductMockData = createProductMock();
      createProductMockData.storeId = newStore.insertedId.toString();
      const newProduct = await dbConnection.collection('products').insertOne(createProductMockData);

      const createCartMockData = createCartMock();
      createCartMockData.userId = userId;
      createCartMockData.storeId = newStore.insertedId.toString();
      createCartMockData.listProducts[0].productId = newProduct.insertedId.toString();
      await dbConnection.collection('carts').insertOne(createCartMockData);

      const createBillMockData = billMock();
      createBillMockData.storeId = newStore.insertedId.toString();
      createBillMockData.userId = userId;
      createBillMockData.listProducts[0].productId = newProduct.insertedId.toString();
      await dbConnection.collection('bills').insertOne(createBillMockData);

      const URL = `/user/admin/users-most-bills?limit=2`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy thông tin danh sách người dùng mua hàng nhiều nhất thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('User follow store successfully', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenUser = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);

    it('PUT /user/user-follow-store?storeId= should follow store successfully', async () => {
      const URL = `/user/user-follow-store?storeId=${storeId}`;

      const response = await request(httpServer).put(URL).send({}).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Follow cửa hàng thành công!');
    }, 10000);
  });

  describe('User add friend successfully', () => {
    it('PUT /user/user-add-friend?userIdReceive= should add friend successfully', async () => {
      const URL = `/user/user-add-friend?userIdReceive=${sellerId}`;

      const response = await request(httpServer).put(URL).send({}).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Kết bạn thành công!');
    }, 10000);
  });

  describe('Get all user by admin successfully', () => {
    it('GET /user/admin?page=1&limit=2&search= should return list user successfully', async () => {
      const URL = `/user/admin?page=1&limit=2`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách người dùng thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('Update user information successfully', () => {
    it('PATCH /user/user/:id should update user information successfully', async () => {
      const URL = `/user/user/${userId}`;

      const response = await request(httpServer).patch(URL).send({ fullName: 'Thang Luong' }).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Cập nhật thông tin người dùng thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('Get detail user information successfully', () => {
    it('GET /user/user/:id should return detail user information successfully', async () => {
      const URL = `/user/user/${userId}`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy thông tin người dùng thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });
});
