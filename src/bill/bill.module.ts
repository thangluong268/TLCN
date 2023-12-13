import {  Module, forwardRef } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillSchema } from './schema/bill.schema';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';
import { ProductModule } from '../product/product.module';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { CartModule } from '../cart/cart.module';

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
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
