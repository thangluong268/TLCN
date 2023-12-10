import { Test, TestingModule } from "@nestjs/testing"
import { Connection } from "mongoose"
import * as request from 'supertest';
import { DatabaseService } from "../src/database/database.service";
import { INestApplication, } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { ProductController } from "../src/product/product.controller";
import { CreateUserDto } from "../src/user/dto/create-user.dto";
import { createProductMock, productMock } from "../src/product/mock-dto/product.mock";
import { ProductService } from "../src/product/product.service";
import { createUserMock } from "../src/user/mock-dto/user.mock";
import { createStoreMock } from "../src/store/mock-dto/store.mock";
import { createCategoryMock } from "../src/category/mock-dto/category.mock";

describe('ProductController E2E Test', () => {
    let dbConnection: Connection;
    let httpServer: any;
    let app: INestApplication;
    let controller: ProductController;

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

    describe('createProduct', () => {
        it('should create a product', async () => {
            const newUser = await dbConnection.collection('users').insertOne(createUserMock())
            const newStore = await dbConnection.collection('stores').insertOne({ ...createStoreMock(), userId: newUser.insertedId })
            const newCategory = await dbConnection.collection('categories').insertOne(createCategoryMock())

            const response = await request(httpServer).post('/product/seller').send({...createProductMock(), categoryId: newCategory.insertedId});

            expect(response.status).toBe(200);
            expect(response.body.metadata.data).toMatchObject(createProductMock());

        })
    })

    describe('getAllBySearchPublic', () => {
        it('Should return an array of products', async () => {
            await dbConnection.collection('products').insertOne(productMock())
            const response = await request(httpServer).get('/product?page=1&limit=5');

            expect(response.status).toBe(200);
            expect(response.body.metadata.data.total).toEqual(1);
            expect(response.body.metadata.data.products).toMatchObject([productMock()]);
        })
    })

})