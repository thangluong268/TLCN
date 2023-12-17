import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { RoleModule } from '../role/role.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { PaymentModule } from './payment/payment.module';
import { BillSchema } from './schema/bill.schema';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bill', schema: BillSchema }]),
    AbilityModule,
    RoleModule,
    PaymentModule,
    CartModule,
    ProductModule,
    StoreModule,
    forwardRef(() => UserModule),
    NotificationModule,
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
