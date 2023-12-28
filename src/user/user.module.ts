import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { BillModule } from '../bill/bill.module';
import { NotificationModule } from '../notification/notification.module';
import { RoleModule } from '../role/role.module';
import { StoreModule } from '../store/store.module';
import { HasPermitRoleMiddleware } from '../user/middleware/HasPermitRole.middleware';
import { HasSameRoleUserMiddleware } from './middleware/HasSameRoleUser.middleware';
import { UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StoreSchema } from '../store/schema/store.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Store', schema: StoreSchema },
    ]),
    AbilityModule,
    RoleModule,
    BillModule,
    StoreModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HasPermitRoleMiddleware)
      .forRoutes(
        { path: 'user/user/:id', method: RequestMethod.GET },
        { path: 'user/user/:id', method: RequestMethod.PUT },
        { path: 'user/user/:id', method: RequestMethod.DELETE },
      );
    consumer
      .apply(HasSameRoleUserMiddleware)
      .forRoutes({ path: 'user/user/addFriend/:id', method: RequestMethod.POST }, { path: 'user/user/unFriend/:id', method: RequestMethod.POST });
  }
}
