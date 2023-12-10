import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserotpSchema } from './schema/userotp.schema';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { UserotpService } from './userotp.service';
import { UserotpController } from './userotp.controller';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Userotp', schema: UserotpSchema }]),
    AbilityModule,
    RoleModule,
    UserModule,
    FirebaseModule
  ],
  controllers: [UserotpController],
  providers: [UserotpService],
  exports: [UserotpService],
})
export class UserotpModule { }