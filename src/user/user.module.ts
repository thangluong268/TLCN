import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { HasPermitRoleMiddleware } from '../user/middleware/HasPermitRole.middleware';
import { HasSameRoleUserMiddleware } from './middleware/HasSameRoleUser.middleware';
import { BillModule } from 'src/bill/bill.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), 
  forwardRef(() => BillModule),
  AbilityModule, 
  RoleModule,
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HasPermitRoleMiddleware)
      .forRoutes({ path: 'user/user/:id', method: RequestMethod.GET }, { path: 'user/user/:id', method: RequestMethod.PUT }, { path: 'user/user/:id', method: RequestMethod.DELETE })
    consumer
      .apply(HasSameRoleUserMiddleware)
      .forRoutes({ path: 'user/user/addFriend/:id', method: RequestMethod.POST }, { path: 'user/user/unFriend/:id', method: RequestMethod.POST })
  }
}