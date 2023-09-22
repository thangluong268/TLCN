import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserotpSchema } from './schema/userotp.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { UserotpService } from './userotp.service';
import { UserotpController } from './userotp.controller';
import { HasUserMiddleware } from './middleware/HasUser.middleware';
import FreedomCustom from 'src/exceptions/FreedomCustom.exception';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Userotp', schema: UserotpSchema }]), AbilityModule, RoleModule],
  controllers: [UserotpController],
  providers: [UserotpService, FreedomCustom],
  exports: [UserotpService],
})
export class UserotpModule {
  // Middleware for user
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HasUserMiddleware)
      .forRoutes({ path: 'userotp/user/sendotp/:id', method: RequestMethod.POST })
  }

}