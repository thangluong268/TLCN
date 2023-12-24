import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { createNotificationMock } from '../src/notification/mock-dto/notification.mock';
import { NotificationController } from '../src/notification/notification.controller';
import { RoleName } from '../src/role/schema/role.schema';
import { createUserMock, createUserMock2 } from '../src/user/mock-dto/user.mock';

describe('Notification Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: NotificationController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let accessTokenUser: string;
  let userId_1: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userId_2: string;
  let notiId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<NotificationController>(NotificationController);
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

  describe('Create notification successfully', () => {
    it('POST /notification should create a notification successfully', async () => {
      const newUser = await dbConnection.collection('users').insertOne(createUserMock2());
      await dbConnection.collection('roles').updateOne({ name: RoleName.USER }, { $push: { listUser: newUser.insertedId.toString() } });

      userId_2 = newUser.insertedId.toString();

      const URL = `/notification`;

      const createNotiData = createNotificationMock();
      createNotiData.userIdFrom = userId_1;
      createNotiData.userIdTo = userId_2;

      const response = await request(httpServer).post(URL).send(createNotiData).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Tạo thông báo thành công!');
      notiId = response.body.metadata.data._id;
    }, 10000);
  });

  describe('Get all notification paging successfully', () => {
    it('GET /notification should return list notification paging successfully', async () => {
      const URL = `/notification?page=1&limit=2`;

      const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Lấy danh sách thông báo thành công!');
      expect(response.body.metadata.data).toHaveProperty('total');
      expect(response.body.metadata.data).toHaveProperty('notifications');
    }, 10000);
  });

  describe('Update notification successfully', () => {
    it('PATCH /notification/:id should update status notification successfully', async () => {
      const URL = `/notification/${notiId}`;

      const response = await request(httpServer).patch(URL).send({ status: true }).set('Authorization', `Bearer ${accessTokenUser}`);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toEqual('Cập nhật thông báo thành công!');
    }, 10000);
  });
});
