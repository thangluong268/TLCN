import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CategoryController } from '../src/category/category.controller';
import { DatabaseService } from '../src/database/database.service';
import { RoleName } from '../src/role/schema/role.schema';
import { createUserMock } from '../src/user/mock-dto/user.mock';
import { createCategoryMock } from '../src/category/mock-dto/category.mock';

describe('Category Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: CategoryController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let accessTokenManager: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<CategoryController>(CategoryController);
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  beforeEach(async () => {}, 10000);

  it('Category controller should be defined', () => {
    expect(controller).toBeDefined();
  }, 10000);

  describe('Login', () => {
    const URL_LOGIN = '/auth/login';

    it('POST /auth/login Should login successfully', async () => {
      await dbConnection.collection('users').deleteMany({});

      const newUser2 = await dbConnection.collection('users').insertOne(createUserMock());
      await dbConnection.collection('roles').updateOne({ name: RoleName.MANAGER_PRODUCT }, { $push: { listUser: newUser2.insertedId.toString() } });

      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessTokenManager = response.body.metadata.data.stsTokenManager.accessToken;
    }, 10000);
  });

  describe('Create category successfully', () => {
    it('POST /category/manager should create a category successfully', async () => {
      const URL = `/category/manager`;

      const response = await request(httpServer).post(URL).send(createCategoryMock()).set('Authorization', `Bearer ${accessTokenManager}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Tạo danh mục thành công!');
    }, 10000);
  });

  describe('Get all category successfully', () => {
    it('GET /category should return list category successfully', async () => {
      const URL = `/category`;

      const response = await request(httpServer).get(URL);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách danh mục thành công!');
      expect(response.body.metadata).toHaveProperty('data');
    }, 10000);
  });
});
