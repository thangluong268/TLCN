import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CartController } from '../src/cart/cart.controller';
import { DatabaseService } from '../src/database/database.service';
import { productMock } from '../src/product/mock-dto/product.mock';
import { RoleName } from '../src/role/schema/role.schema';
import { createStoreMock } from '../src/store/mock-dto/store.mock';
import { createUserMock, createUserMock2 } from '../src/user/mock-dto/user.mock';

describe('Cart Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: CartController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let accessTokenUser: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userId: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userSellerId: string;
  let productId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<CartController>(CartController);
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  beforeEach(async () => {}, 10000);

  it('Cart controller should be defined', () => {
    expect(controller).toBeDefined();
  }, 10000);

  describe('Login', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      await dbConnection.collection('carts').deleteMany({});
      await dbConnection.collection('users').deleteMany({});

      const newUser1 = await dbConnection.collection('users').insertOne(createUserMock2());
      userId = newUser1.insertedId.toString();
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser1.insertedId.toString() } });

      const newUser2 = await dbConnection.collection('users').insertOne(createUserMock());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser2.insertedId.toString() } });

      const createStoreData = createStoreMock();
      createStoreData.userId = newUser2.insertedId.toString();
      const newStore = await dbConnection.collection('stores').insertOne(createStoreData);
      await dbConnection.collection('roles').updateOne({ name: RoleName.SELLER }, { $push: { listUser: newUser2.insertedId.toString() } });

      const newProduct = await dbConnection.collection('products').insertOne({ ...productMock(), storeId: newStore.insertedId.toString() });

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthang730@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenUser = response.body.metadata.data.stsTokenManager.accessToken;
      userSellerId = newUser2.insertedId.toString();
      productId = newProduct.insertedId.toString();
    }, 10000);
  });

  describe('Create cart successfully', () => {
    it('POST /cart/user?productId= should create a cart successfully', async () => {
      const URL = `/cart/user?productId=${productId}`;

      const response = await request(httpServer).post(URL).send({}).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Thêm sản phẩm vào giỏ hàng thành công!');
      expect(response.body.metadata.data).toHaveProperty('userId');
      expect(response.body.metadata.data).toHaveProperty('storeId');
      expect(response.body.metadata.data).toHaveProperty('storeAvatar');
      expect(response.body.metadata.data).toHaveProperty('storeName');
      expect(response.body.metadata.data).toHaveProperty('listProducts');
      expect(response.body.metadata.data).toHaveProperty('totalPrice');
      expect(response.body.metadata.data).toHaveProperty('_id');
      expect(response.body.metadata.data).toHaveProperty('createdAt');
    }, 10000);
  });

  describe('Get all cart paging successfully', () => {
    it('GET /cart/user?page=1&limit=5&search= should return list cart paging successfully', async () => {
      const URL = `/cart/user?page=1&limit=5`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách giỏ hàng thành công!');
      expect(response.body.metadata.data).toHaveProperty('total');
      expect(response.body.metadata.data).toHaveProperty('carts');
    }, 10000);
  });

  describe('Get all cart successfully', () => {
    it('GET /cart/user/get-all should return list cart successfully', async () => {
      const URL = `/cart/user/get-all`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách giỏ hàng thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('Remove Product In Cart Successfully', () => {
    it('DELETE /cart/user?productId=657bd5a5c5fcce0d91868780 remove a cart successfully', async () => {
      const URL = `/cart/user?productId=${productId}`;

      const response = await request(httpServer).delete(URL).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Xóa sản phẩm khỏi giỏ hàng thành công!');
    }, 10000);
  });

});
