import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createCategoryMock } from '../src/category/mock-dto/category.mock';
import { DatabaseService } from '../src/database/database.service';
import { createProductMock, productMock } from '../src/product/mock-dto/product.mock';
import { ProductController } from '../src/product/product.controller';
import { RoleName } from '../src/role/schema/role.schema';
import { createStoreMock } from '../src/store/mock-dto/store.mock';
import { createUserMock, createUserMock2 } from '../src/user/mock-dto/user.mock';

describe('Product Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: ProductController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let accessTokenUser: string;
  let accessTokenSeller: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userId: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userSellerId: string;
  let storeId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<ProductController>(ProductController);
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  beforeEach(async () => {
    await dbConnection.collection('products').deleteMany({});
  }, 10000);

  it('Product controller should be defined', () => {
    expect(controller).toBeDefined();
  }, 10000);

  describe('Create product', () => {
    const URL = '/product/seller';
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
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

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenSeller = response.body.metadata.data.stsTokenManager.accessToken;
      storeId = newStore.insertedId.toString();
      userSellerId = newUser2.insertedId.toString();
    }, 10000);

    it('POST /product/seller should create a product', async () => {
      const newCategory = await dbConnection.collection('categories').insertOne(createCategoryMock());

      const response = await request(httpServer)
        .post(URL)
        .send({ ...createProductMock(), categoryId: newCategory.insertedId })
        .set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.status).toBe(201);
      expect(response.body.metadata.data).toHaveProperty('avatar');
      expect(response.body.metadata.data).toHaveProperty('quantity');
      expect(response.body.metadata.data).toHaveProperty('productName');
      expect(response.body.metadata.data).toHaveProperty('price');
      expect(response.body.metadata.data).toHaveProperty('description');
      expect(response.body.metadata.data).toHaveProperty('categoryId');
      expect(response.body.metadata.data).toHaveProperty('keywords');
      expect(response.body.metadata.data).toHaveProperty('status');
      expect(response.body.metadata.data).toHaveProperty('_id');
      expect(response.body.metadata.data).toHaveProperty('createdAt');
      expect(response.body.metadata.data).toHaveProperty('storeId');
    }, 10000);
  });

  describe('Get all By search Admin', () => {
    const URL = '/product/seller?page=1&limit=5';
    it('GET /product/seller?page=1&limit=5 Should return an array of products', async () => {
      await dbConnection.collection('products').insertOne({ ...productMock(), storeId });
      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toHaveProperty('total');
      expect(response.body.metadata.data).toHaveProperty('products');
    }, 10000);
  });

  // describe('Get all by search public', () => {
  //   const URL = '/product?page=1&limit=5';
  //   it('GET /product?page=1&limit=5 Should return an array of products', async () => {
  //     await dbConnection.collection('products').insertOne({ ...productMock(), storeId });
  //     const response = await request(httpServer).get(URL);

  //     expect(response.status).toBe(200);
  //     expect(response.body.metadata.data).toHaveProperty('total');
  //     expect(response.body.metadata.data).toHaveProperty('products');
  //   }, 10000);
  // });

  describe('Get All Other Product By StoreId Public', () => {
    it('GET /products-other-in-store?page=1&limit=5&storeId=&productId= Should return an array of products', async () => {
      const newProduct = await dbConnection.collection('products').insertOne({ ...productMock(), storeId });

      const URL = `/products-other-in-store?page=1&limit=5&storeId=${storeId}&productId=${newProduct.insertedId.toString()}`;
      const response = await request(httpServer).get(URL);

      expect(response.status).toBe(200);
      expect(response.body.metadata).toHaveProperty('total');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });

  describe('Update Product By Seller', () => {
    it('PATCH /product/seller/:id Should update any field of products', async () => {
      const newProduct = await dbConnection.collection('products').insertOne({ ...productMock(), storeId });
      const URL = `/product/seller/${newProduct.insertedId.toString()}`;
      const response = await request(httpServer)
        .patch(URL)
        .send({ productName: 'Test', quantity: 10 })
        .set('Authorization', `Bearer ${accessTokenSeller}`);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toMatchObject({ ...productMock(), storeId, productName: 'Test', quantity: 10 });
    }, 10000);
  });

  describe('Get list product lasted public', () => {
    const URL = '/product/listProductLasted?limit=2';
    it('GET /product/listProductLasted?limit=2 Should return an array of products', async () => {
      await dbConnection.collection('products').insertOne({ ...productMock(), storeId });
      await dbConnection.collection('products').insertOne({ ...productMock(), storeId });

      const response = await request(httpServer).get(URL);

      expect(response.status).toBe(200);
      expect(response.body.metadata.data).toMatchObject([
        { ...productMock(), storeId },
        { ...productMock(), storeId },
      ]);
    }, 10000);
  });

  describe('Get most product in store public', () => {
    const URL = '/product/mostProductsInStore';
    it('GET /product/mostProductsInStore Should return an array of products', async () => {
      await dbConnection.collection('products').insertOne({ ...productMock(), storeId });
      await dbConnection.collection('products').insertOne({ ...productMock(), storeId });

      const response = await request(httpServer).get(URL);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách sản phẩm thành công!');
      expect(response.body.metadata.data).toBeDefined();
    }, 10000);
  });

  describe('Get random product public', () => {
    const URL = '/product/random?limit=2';
    it('POST /product/random?limit=2 Should return an random array of products', async () => {
      await dbConnection.collection('products').insertOne({ ...productMock(), storeId });
      await dbConnection.collection('products').insertOne({ ...productMock(), storeId });

      const response = await request(httpServer).post(URL).send({ ids: [] });

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy thông tin sản phẩm thành công!');
      expect(response.body.metadata.data).toMatchObject([
        { ...productMock(), storeId },
        { ...productMock(), storeId },
      ]);
    }, 10000);
  });

  describe('Get All By Search And Filter Public', () => {
    it('GET /product-filter?search=&priceMin=100000&priceMax=10000000&quantityMin=0&quantityMax=10 Should return an random array of products', async () => {
      const newCategory = await dbConnection.collection('categories').insertOne(createCategoryMock());

      await dbConnection.collection('products').insertOne({ ...productMock(), categoryId: newCategory.insertedId.toString(), storeId });
      await dbConnection.collection('products').insertOne({ ...productMock(), categoryId: newCategory.insertedId.toString(), storeId });

      const URL = `/product-filter?search=${newCategory.insertedId.toString()}&priceMin=100000&priceMax=10000000&quantityMin=0&quantityMax=10`;

      const response = await request(httpServer).get(URL);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách sản phẩm thành công!');
      expect(response.body.metadata.data).toHaveProperty('total');
      expect(response.body.metadata.data).toHaveProperty('products');
    }, 10000);
  });

  describe('Get detail product public', () => {
    it('GET /product/:id Should return detail of products', async () => {
      const newCategory = await dbConnection.collection('categories').insertOne(createCategoryMock());

      const newProduct = await dbConnection
        .collection('products')
        .insertOne({ ...productMock(), categoryId: newCategory.insertedId.toString(), storeId });

      const URL = `/product/${newProduct.insertedId.toString()}`;
      const response = await request(httpServer).get(URL);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy thông tin sản phẩm thành công!');
      expect(response.body.metadata.data).toHaveProperty('_id');
      expect(response.body.metadata.data).toHaveProperty('avatar');
      expect(response.body.metadata.data).toHaveProperty('quantity');
      expect(response.body.metadata.data).toHaveProperty('productName');
      expect(response.body.metadata.data).toHaveProperty('price');
      expect(response.body.metadata.data).toHaveProperty('description');
      expect(response.body.metadata.data).toHaveProperty('categoryId');
      expect(response.body.metadata.data).toHaveProperty('keywords');
      expect(response.body.metadata.data).toHaveProperty('storeId');
      expect(response.body.metadata).toHaveProperty('quantityDelivered');
    }, 10000);
  });

  // // describe('Delete a product', () => {
  // //     it('DELETE /product/:id Should delete a products', async () => {
  // //         const newProduct = await dbConnection.collection('products').insertOne(productMock())
  // //         const URL = `/product/${newProduct.insertedId.toString()}`
  // //         const response = await request(httpServer).delete(URL)
  // //             .set('Authorization', `Bearer ${accessToken}`);

  // //         expect(response.status).toBe(200);
  // //         expect(response.body.message).toEqual('Xóa sản phẩm thành công!');
  // //     }, 10000)
  // // })
});
