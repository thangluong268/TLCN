import { Test, TestingModule } from "@nestjs/testing"
import { Connection } from "mongoose"
import * as request from 'supertest';
import { DatabaseService } from "../src/database/database.service";
import { INestApplication, } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { createUserMock } from "../src/user/mock-dto/user.mock";
import { AuthController } from "../src/auth/auth.controller";

describe('Auth Controller E2E Test', () => {
    let dbConnection: Connection;
    let httpServer: any;
    let app: INestApplication;
    let controller: AuthController;
    let accessToken: string;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
        httpServer = app.getHttpServer();
        controller = moduleRef.get<AuthController>(AuthController);
    }, 10000)

    beforeEach(async () => {

    })

    it('Auth controller should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Login', () => {
        const URL = '/auth/login'
        it('POST /auth/login Should login successfully', async () => {
            const newUser = await dbConnection.collection('users').insertOne(createUserMock())

            const response = await request(httpServer).post(URL).send({
                email: 'luongthangg268@gmail.com',
                password: 'Thang@11'
            })

            expect(response.status).toBe(201);
        }, 10000)
    })

    describe('Signup', () => {
        const URL = '/auth/signup'
        it('POST /auth/signup Should register a new user successfully', async () => {
            const response = await request(httpServer).post(URL).send({
                fullName: "Thắng Lương",
                email: 'luongthangg268@gmail.com',
                password: 'Thang@11'
            })

            expect(response.status).toBe(201);
            expect(response.body.metadata.data).toMatchObject({ fullName: "Thắng Lương", email: 'luongthangg268@gmail.com' });
        }, 30000)
    })

    describe('Logout', () => {
        const URL_LOGIN = '/auth/login'
        const URL_LOGOUT = '/auth/logout'
        let refreshToken: string;
        let newUserId: string;

        it('POST /auth/login Should login successfully', async () => {
            const newUser = await dbConnection.collection('users').insertOne(createUserMock())

            const response = await request(httpServer).post(URL_LOGIN).send({
                email: 'luongthangg268@gmail.com',
                password: 'Thang@11'
            })

            expect(response.status).toBe(201);
            accessToken = response.body.metadata.data.stsTokenManager.accessToken;
            refreshToken = response.body.metadata.data.stsTokenManager.refreshToken;
            newUserId = newUser.insertedId.toString();

        }, 10000)

        it('DELETE /auth/logout Should logout user successfully', async () => {

            const response = await request(httpServer).delete(URL_LOGOUT)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toEqual('Đăng xuất thành công!');

        }, 10000)
    })

    describe('Forget Password', () => {
        const URL = '/auth/forgetPassword'
        it('POST /auth/forgetPassword Should update password of user successfully', async () => {
            await dbConnection.collection('users').insertOne(createUserMock())
            const response = await request(httpServer).post(URL).send({
                email: 'luongthangg268@gmail.com',
                password: 'Thang@11'
            })

            expect(response.status).toBe(201);
            expect(response.body.message).toEqual('Lấy lại mật khẩu thành công!');

        }, 30000)
    })

    
    afterAll(async () => {
        await app.close();
    })

})