import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';
import { PreAuthMiddleware } from './PreAuthMiddleware';

@Module({
  imports: [],
  controllers: [FirebaseController],
  providers: [
    FirebaseService,
  ],
  exports: [
    FirebaseService,
  ],
})
export class FirebaseModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(PreAuthMiddleware).forRoutes({
      path: '/api/firebase/secure/*',
      method: RequestMethod.ALL,
    });
  }
}
