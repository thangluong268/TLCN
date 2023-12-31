/* eslint-disable @typescript-eslint/no-explicit-any */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ErrorMiddleware } from './core/error.middleware';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });
  app.setGlobalPrefix('/api');
  SwaggerModule.setup('api', app, createDocument(app), {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorMiddleware());

  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
