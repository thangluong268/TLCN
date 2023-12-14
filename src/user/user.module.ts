import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { BillModule } from '../bill/bill.module';
import { RoleModule } from '../role/role.module';
import { HasPermitRoleMiddleware } from '../user/middleware/HasPermitRole.middleware';
import { HasSameRoleUserMiddleware } from './middleware/HasSameRoleUser.middleware';
import { UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), AbilityModule, RoleModule, BillModule, StoreModule],
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
