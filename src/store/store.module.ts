import { Module, forwardRef } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schema/store.schema';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { ProductModule } from '../product/product.module';
import { BillModule } from '../bill/bill.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    AbilityModule,
    RoleModule,
    forwardRef(() => ProductModule),
    forwardRef(() => FeedbackModule),
    forwardRef(() => UserModule),
    forwardRef(() => BillModule),
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
