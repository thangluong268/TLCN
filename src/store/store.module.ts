import { Module, forwardRef } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schema/store.schema';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    forwardRef(() => UserModule),
    AbilityModule,
    RoleModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService]
})
export class StoreModule {}
