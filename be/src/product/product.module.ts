import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { ProductSchema } from './schema/product.schema';
import { StoreModule } from '../store/store.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { BillModule } from '../bill/bill.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    AbilityModule,
    RoleModule,
    NotificationModule,
    CategoryModule,
    forwardRef(() => BillModule),
    EvaluationModule,
    forwardRef(() => UserModule),
    forwardRef(() => StoreModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
