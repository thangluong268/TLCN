import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { BillController } from '../src/bill/bill.controller';
import { createBillMock } from '../src/bill/mock-dto/bill.mock';
import { createCartMock } from '../src/cart/mock-dto/cart.mock';
import { DatabaseService } from '../src/database/database.service';
import { createProductMock } from '../src/product/mock-dto/product.mock';
import { RoleName } from '../src/role/schema/role.schema';
import { createStoreMock } from '../src/store/mock-dto/store.mock';
import { createAdminMock, createUserMock, createUserMock2 } from '../src/user/mock-dto/user.mock';

describe('Bill Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: BillController;
  let accessTokenUser: string;
  let accessTokenSeller: string;
  let accessTokenAdmin: string;
  let userId: string;
  let billId: string;
  let userSellerId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<BillController>(BillController);
  }, 10000);

  beforeEach(async () => {}, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  it('Bill controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create bill', () => {
    const URL_TEST = '/bill/user';
    const URL_LOGIN = '/auth/login';
    it('POST /auth/login Should login successfully', async () => {
      await dbConnection.collection('users').deleteMany({});
      const newUser = await dbConnection.collection('users').insertOne(createUserMock2());
      userId = newUser.insertedId.toString();
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser.insertedId.toString() } });

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthang730@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenUser = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);

    it('POST /bill/user should create a bill', async () => {
      const newUser = await dbConnection.collection('users').insertOne(createUserMock());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser.insertedId.toString() } });

      const createStoreData = createStoreMock();
      createStoreData.userId = newUser.insertedId.toString();
      const newStore = await dbConnection.collection('stores').insertOne(createStoreData);
      await dbConnection.collection('roles').updateOne({ name: RoleName.SELLER }, { $push: { listUser: newUser.insertedId.toString() } });

      userSellerId = newUser.insertedId.toString();

      const createProductMockData = createProductMock();
      createProductMockData.storeId = newStore.insertedId.toString();
      const newProduct = await dbConnection.collection('products').insertOne(createProductMockData);

      const createCartMockData = createCartMock();
      createCartMockData.userId = userId;
      createCartMockData.storeId = newStore.insertedId.toString();
      createCartMockData.listProducts[0].productId = newProduct.insertedId.toString();
      await dbConnection.collection('carts').insertOne(createCartMockData);

      const createBillMockData = createBillMock();
      createBillMockData.data[0].storeId = newStore.insertedId.toString();
      createBillMockData.data[0].listProducts[0].productId = newProduct.insertedId.toString();

      await dbConnection.collection('notifications').deleteMany({});

      const response = await request(httpServer).post(URL_TEST).send(createBillMockData).set('Authorization', `Bearer ${accessTokenUser}`);

      const newNotificationSeller = await dbConnection
        .collection('notifications')
        .findOne({ userIdFrom: userId, userIdTo: newUser.insertedId.toString() });

      const newNotificationUser = await dbConnection.collection('notifications').findOne({ userIdFrom: userId, userIdTo: userId });

      expect(response.status).toBe(201);
      expect(response.body.metadata.data[0]).toHaveProperty('storeId');
      expect(response.body.metadata.data[0]).toHaveProperty('listProducts');
      expect(response.body.metadata.data[0]).toHaveProperty('notes');
      expect(response.body.metadata.data[0]).toHaveProperty('totalPrice');
      expect(response.body.metadata.data[0]).toHaveProperty('status');
      expect(response.body.metadata.data[0]).toHaveProperty('_id');
      expect(response.body.metadata.data[0]).toHaveProperty('createdAt');
      expect(response.body.metadata.data[0]).toHaveProperty('userId');
      expect(response.body.metadata.data[0]).toHaveProperty('deliveryMethod');
      expect(response.body.metadata.data[0]).toHaveProperty('paymentMethod');
      expect(response.body.metadata.data[0]).toHaveProperty('receiverInfo');
      expect(response.body.metadata.data[0]).toHaveProperty('deliveryFee');
      expect(response.body.metadata.data[0]).toHaveProperty('isPaid');
      expect(newNotificationSeller).toBeDefined();
      expect(newNotificationUser).toBeDefined();

      billId = response.body.metadata.data[0]._id;
    }, 20000);
  });

  describe('Count Total By Status Seller', () => {
    const URL_TEST = '/bill/seller/count-total-by-status?year=2023';
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenSeller = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);

    it('GET /bill/seller/count-total-by-status?year=2023 Should return total of count per status', async () => {
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('NEW');
      expect(response.body.metadata.data).toHaveProperty('CONFIRMED');
      expect(response.body.metadata.data).toHaveProperty('DELIVERING');
      expect(response.body.metadata.data).toHaveProperty('DELIVERED');
      expect(response.body.metadata.data).toHaveProperty('CANCELLED');
      expect(response.body.metadata.data).toHaveProperty('RETURNED');
    }, 10000);
  });

  describe('Count Total By Status User', () => {
    const URL_TEST = '/bill/user/count-total-by-status';

    it('GET /bill/user/count-total-by-status Should return total of count per status', async () => {
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data[0]).toHaveProperty('status');
      expect(response.body.metadata.data[0]).toHaveProperty('title');
      expect(response.body.metadata.data[0]).toHaveProperty('value');
      expect(response.body.metadata.data[1]).toHaveProperty('status');
      expect(response.body.metadata.data[1]).toHaveProperty('title');
      expect(response.body.metadata.data[1]).toHaveProperty('value');
      expect(response.body.metadata.data[2]).toHaveProperty('status');
      expect(response.body.metadata.data[2]).toHaveProperty('title');
      expect(response.body.metadata.data[2]).toHaveProperty('value');
      expect(response.body.metadata.data[3]).toHaveProperty('status');
      expect(response.body.metadata.data[3]).toHaveProperty('title');
      expect(response.body.metadata.data[3]).toHaveProperty('value');
      expect(response.body.metadata.data[4]).toHaveProperty('status');
      expect(response.body.metadata.data[4]).toHaveProperty('title');
      expect(response.body.metadata.data[4]).toHaveProperty('value');
      expect(response.body.metadata.data[5]).toHaveProperty('status');
      expect(response.body.metadata.data[5]).toHaveProperty('title');
      expect(response.body.metadata.data[5]).toHaveProperty('value');
    }, 10000);
  });

  describe('Calculate Revenue By Year', () => {
    const URL_TEST = '/bill/seller/calculate-revenue-by-year?year=2023';

    it('GET /bill/seller/calculate-revenue-by-year?year=2023 Should return revenue of store per month', async () => {
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenSeller}`);
      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('data');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 1');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 2');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 3');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 4');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 5');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 6');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 7');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 8');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 9');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 10');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 11');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 12');
      expect(response.body.metadata.data).toHaveProperty('revenueTotalAllTime');
      expect(response.body.metadata.data).toHaveProperty('revenueTotalInYear');
      expect(response.body.metadata.data).toHaveProperty('minRevenue');
      expect(response.body.metadata.data.minRevenue).toBeDefined();
      expect(response.body.metadata.data).toHaveProperty('maxRevenue');
      expect(response.body.metadata.data.maxRevenue).toBeDefined();
    }, 10000);
  });

  describe('Count Charity By Year', () => {
    const URL_TEST = '/bill/seller/count-charity-by-year?year=2023';

    it('GET /bill/seller/count-charity-by-year?year=2023 Should return number of charity of store per month', async () => {
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('data');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 1');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 2');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 3');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 4');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 5');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 6');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 7');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 8');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 9');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 10');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 11');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 12');
      expect(response.body.metadata.data).toHaveProperty('charityTotalAllTime');
      expect(response.body.metadata.data).toHaveProperty('charityTotalInYear');
      expect(response.body.metadata.data).toHaveProperty('minGive');
      expect(response.body.metadata.data).toHaveProperty('maxGive');
    }, 10000);
  });

  describe('Get All By Status User', () => {
    const URL_TEST = '/bill/user?status=NEW';

    it('GET /bill/user?status=NEW Should return list bill by status of user successfully', async () => {
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('total');
      expect(response.body.metadata.data).toHaveProperty('fullData');
    }, 10000);
  });

  describe('Get All By Status Seller', () => {
    const URL_TEST = '/bill/seller?status=NEW';

    it('GET /bill/seller?status=NEW Should return list bill by status of seller successfully', async () => {
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('total');
      expect(response.body.metadata.data).toHaveProperty('fullData');
    }, 10000);
  });

  describe('Get By Id', () => {
    it('GET /bill/user/:id Should return a bill by id of user successfully', async () => {
      const URL_TEST = `/bill/user/${billId}`;
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('_id');
      expect(response.body.metadata.data).toHaveProperty('storeInfo');
      expect(response.body.metadata.data).toHaveProperty('listProductsFullInfo');
      expect(response.body.metadata.data).toHaveProperty('userInfo');
      expect(response.body.metadata.data).toHaveProperty('notes');
      expect(response.body.metadata.data).toHaveProperty('totalPrice');
      expect(response.body.metadata.data).toHaveProperty('deliveryMethod');
      expect(response.body.metadata.data).toHaveProperty('paymentMethod');
      expect(response.body.metadata.data).toHaveProperty('receiverInfo');
      expect(response.body.metadata.data).toHaveProperty('deliveryFee');
      expect(response.body.metadata.data).toHaveProperty('status');
      expect(response.body.metadata.data).toHaveProperty('isPaid');
      expect(response.body.metadata.data).toHaveProperty('createdAt');
    }, 10000);
  });

  describe('Update Status User', () => {
    it('PUT /bill/user/:id?status= Should update status a bill by user successfully', async () => {
      const URL_TEST = `/bill/user/${billId}?status=CANCELLED`;

      await dbConnection.collection('notifications').deleteMany({});

      const response = await request(httpServer).put(URL_TEST).set('Authorization', `Bearer ${accessTokenUser}`);

      const newNotificationSeller = await dbConnection.collection('notifications').findOne({ userIdFrom: userId, userIdTo: userSellerId });

      const newNotificationUser = await dbConnection.collection('notifications').findOne({ userIdFrom: userId, userIdTo: userId });

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Cập nhật trạng thái đơn hàng thành công!');
      expect(newNotificationSeller).toBeDefined();
      expect(newNotificationUser).toBeDefined();
    }, 10000);
  });

  describe('Update Status Seller', () => {
    it('PUT /bill/seller/:id?status= Should update status a bill by user successfully', async () => {
      const URL_TEST = `/bill/seller/${billId}?status=CONFIRMED`;

      await dbConnection.collection('notifications').deleteMany({});

      const response = await request(httpServer).put(URL_TEST).set('Authorization', `Bearer ${accessTokenSeller}`);

      const newNotificationUser = await dbConnection.collection('notifications').findOne({ userIdFrom: userSellerId, userIdTo: userId });

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Cập nhật trạng thái đơn hàng thành công!');
      expect(newNotificationUser).toBeDefined();
    }, 10000);
  });

  describe('Count Total Data By Admin', () => {
    const URL_LOGIN = '/auth/login';
    it('POST /auth/login Should login successfully', async () => {
      const newUser = await dbConnection.collection('users').insertOne(createAdminMock());
      userId = newUser.insertedId.toString();
      await dbConnection.collection('roles').updateOne({ name: RoleName.ADMIN }, { $push: { listUser: newUser.insertedId.toString() } });

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'admin@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenAdmin = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);

    it('GET /bill/admin/count-total-data Should return total data successfully', async () => {
      const URL_TEST = `/bill/admin/count-total-data`;
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('totalProduct');
      expect(response.body.metadata.data).toHaveProperty('totalStore');
      expect(response.body.metadata.data).toHaveProperty('totalUser');
      expect(response.body.metadata.data).toHaveProperty('totalRevenue');
    }, 10000);
  });

  describe('Calculate Total Revenue By Year By Admin', () => {
    it('GET /bill/admin/calculate-total-revenue-by-year?year=2023 Should return revenue of all time per month', async () => {
      const URL_TEST = `/bill/admin/calculate-total-revenue-by-year?year=2023`;
      const response = await request(httpServer).get(URL_TEST).set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('data');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 1');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 2');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 3');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 4');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 5');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 6');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 7');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 8');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 9');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 10');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 11');
      expect(response.body.metadata.data).toHaveProperty('data.Tháng 12');
      expect(response.body.metadata.data).toHaveProperty('revenueTotalAllTime');
      expect(response.body.metadata.data).toHaveProperty('revenueTotalInYear');
      expect(response.body.metadata.data).toHaveProperty('minRevenue');
      expect(response.body.metadata.data.minRevenue).toBeDefined();
      expect(response.body.metadata.data).toHaveProperty('maxRevenue');
      expect(response.body.metadata.data.maxRevenue).toBeDefined();
    }, 10000);
  });
});
