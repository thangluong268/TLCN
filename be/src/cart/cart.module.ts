import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schema/cart.schema';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { ProductModule } from '../product/product.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    AbilityModule,
    RoleModule,
    ProductModule,
    StoreModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
