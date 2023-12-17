"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("./swagger/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });
    app.setGlobalPrefix('/api');
    swagger_1.SwaggerModule.setup('api', app, (0, swagger_2.createDocument)(app), {
        swaggerOptions: {
            persistAuthorization: true,
        }
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map