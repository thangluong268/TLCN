import { Test, TestingModule } from "@nestjs/testing"
import { Connection } from "mongoose"
import * as request from 'supertest';
import { DatabaseService } from "../src/database/database.service";
import { INestApplication, } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { ProductController } from "../src/product/product.controller";
import { createProductMock, productMock } from "../src/product/mock-dto/product.mock";
import { createUserMock } from "../src/user/mock-dto/user.mock";
import { createStoreMock } from "../src/store/mock-dto/store.mock";
import { createCategoryMock } from "../src/category/mock-dto/category.mock";

describe('Product Controller E2E Test', () => {
    let dbConnection: Connection;
    let httpServer: any;
    let app: INestApplication;
    let controller: ProductController;
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
        controller = moduleRef.get<ProductController>(ProductController);
    })

    beforeEach(async () => {
        await dbConnection.collection('products').deleteMany({});
    })

    afterAll(async () => {
        await app.close();
    })

    it('Product controller should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Login', () => {
        const URL = '/auth/login'
        it('POST /auth/login Should login successfully', async () => {
            const response = await request(httpServer).post(URL).send({
                email: 'luongthangg268@gmail.com',
                password: 'Thang@11'
            })

            expect(response.status).toBe(201);
            accessToken = response.body.metadata.data.stsTokenManager.accessToken;

        })
    })

    describe('Create product', () => {
        const URL = '/product/seller'
        it('POST /product/seller should create a product', async () => {
            const newUser = await dbConnection.collection('users').insertOne(createUserMock())
            const newStore = await dbConnection.collection('stores').insertOne({ ...createStoreMock(), userId: newUser.insertedId.toString() })
            const newCategory = await dbConnection.collection('categories').insertOne(createCategoryMock())

            const response = await request(httpServer).post(URL)
                .send({ ...createProductMock(), categoryId: newCategory.insertedId })
                .set('Authorization', `Bearer ${accessToken}`)

            expect(response.status).toBe(201);
            expect(response.body.metadata.data).toMatchObject({ ...createProductMock(), categoryId: newCategory.insertedId.toString() });

        })
    })

    describe('Get all By search seller', () => {
        const URL = '/product/seller?page=1&limit=5'
        it('GET /product/seller?page=1&limit=5 Should return an array of products', async () => {
            await dbConnection.collection('products').insertOne(productMock())
            const response = await request(httpServer).get(URL).set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.metadata.data.total).toEqual(1);
            expect(response.body.metadata.data.products).toMatchObject([productMock()]);
        })
    })

    describe('Get all by search public', () => {
        const URL = '/product?page=1&limit=5'
        it('GET /product?page=1&limit=5 Should return an array of products', async () => {
            await dbConnection.collection('products').insertOne(productMock())
            const response = await request(httpServer).get(URL);

            expect(response.status).toBe(200);
            expect(response.body.metadata.data.total).toEqual(1);
            expect(response.body.metadata.data.products).toMatchObject([productMock()]);
        })
    })

    describe('Update Product', () => {
        it('GET /product?page=1&limit=5 Should return an array of products', async () => {
            const newProduct = await dbConnection.collection('products').insertOne(productMock())
            const URL = `/product/seller/${newProduct.insertedId.toString()}`
            const response = await request(httpServer)
                .patch(URL)
                .send({ productName: 'Test', quantity: 10 })
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.metadata.data).toMatchObject({...productMock(), productName: 'Test', quantity: 10});
        })
    })

})