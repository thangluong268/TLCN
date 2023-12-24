import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { UserotpSchema } from './schema/userotp.schema';
import { UserotpController } from './userotp.controller';
import { UserotpService } from './userotp.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Userotp', schema: UserotpSchema }]), AbilityModule, RoleModule, UserModule, FirebaseModule],
  controllers: [UserotpController],
  providers: [UserotpService],
  exports: [UserotpService],
})
export class UserotpModule {}
