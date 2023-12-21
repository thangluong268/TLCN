import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { BillModule } from '../bill/bill.module';
import { CategoryModule } from '../category/category.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { NotificationModule } from '../notification/notification.module';
import { RoleModule } from '../role/role.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSchema } from './schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    AbilityModule,
    RoleModule,
    forwardRef(() => NotificationModule),
    CategoryModule,
    forwardRef(() => BillModule),
    forwardRef(() => EvaluationModule),
    forwardRef(() => UserModule),
    forwardRef(() => StoreModule),
    FeedbackModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
