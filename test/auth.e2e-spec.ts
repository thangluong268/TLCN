import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthController } from '../src/auth/auth.controller';
import { DatabaseService } from '../src/database/database.service';
import { createRoleMock } from '../src/role/mock-dto/role.mock';
import { createUserMock } from '../src/user/mock-dto/user.mock';

describe('Auth Controller E2E Test', () => {
  let dbConnection: Connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let app: INestApplication;
  let controller: AuthController;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
    controller = moduleRef.get<AuthController>(AuthController);
  }, 10000);

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  }, 10000);

  it('Auth controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login Successfully', () => {
    const URL = '/auth/login';
    it('POST /auth/login Should login successfully', async () => {
      await dbConnection.collection('users').insertOne(createUserMock());

      const response = await request(httpServer).post(URL).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
    }, 10000);
  });

  describe('Login Failure With Wrong Email Or Password', () => {
    const URL = '/auth/login';
    it('POST /auth/login Should login failure with wrong email or password', async () => {
      await dbConnection.collection('users').insertOne(createUserMock());

      const response = await request(httpServer).post(URL).send({
        email: 'luongthang@gmail.com',
        password: '123',
      });

      expect(response.body.status).toBe(400);
      expect(response.body.message).toEqual('Email hoặc mật khẩu không chính xác!');
    }, 10000);
  });

  describe('Signup Successfully', () => {
    const URL = '/auth/signup';
    it('POST /auth/signup Should register a new user successfully', async () => {
      const response = await request(httpServer).post(URL).send({
        fullName: 'Thắng Lương',
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      expect(response.body.metadata.data).toMatchObject({ fullName: 'Thắng Lương', email: 'luongthangg268@gmail.com' });
    }, 30000);
  });

  describe('Signup Failure With Already Exist Email', () => {
    const URL = '/auth/signup';
    it('POST /auth/signup Should failure with already exist email', async () => {
      await dbConnection.collection('users').insertOne(createUserMock());
      const response = await request(httpServer).post(URL).send({
        fullName: 'Thắng Lương',
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.body.status).toBe(409);
      expect(response.body.message).toEqual('Email đã tồn tại!');
    }, 30000);
  });

  describe('Logout', () => {
    const URL_LOGIN = '/auth/login';
    const URL_LOGOUT = '/auth/logout';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let refreshToken: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let newUserId: string;

    it('POST /auth/login Should login successfully', async () => {

      const newUser = await dbConnection.collection('users').insertOne(createUserMock());
      const createRoleData = createRoleMock();
      createRoleData.listUser = [newUser.insertedId.toString()];
      await dbConnection.collection('roles').insertOne(createRoleData);
      
      const response = await request(httpServer).post(URL_LOGIN).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      accessToken = response.body.metadata.data.stsTokenManager.accessToken;
      refreshToken = response.body.metadata.data.stsTokenManager.refreshToken;
      newUserId = newUser.insertedId.toString();
    }, 10000);

    it('DELETE /auth/logout Should logout user successfully', async () => {
      const response = await request(httpServer).delete(URL_LOGOUT).set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Đăng xuất thành công!');
    }, 10000);
  });

  describe('Forget Password', () => {
    const URL = '/auth/forgetPassword';
    it('POST /auth/forgetPassword Should update password of user successfully', async () => {
      await dbConnection.collection('users').insertOne(createUserMock());
      const response = await request(httpServer).post(URL).send({
        email: 'luongthangg268@gmail.com',
        password: 'Thang@11',
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toEqual('Lấy lại mật khẩu thành công!');
    }, 30000);
  });

  afterAll(async () => {
    await app.close();
  });
});
