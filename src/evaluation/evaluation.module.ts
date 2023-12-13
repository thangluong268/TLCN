import { Module, forwardRef } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { EvaluationSchema } from './schema/evaluation.schema';
import { NotificationModule } from '../notification/notification.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';
import { BillModule } from '../bill/bill.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Evaluation', schema: EvaluationSchema }]),
    AbilityModule,
    RoleModule,
    NotificationModule,
    forwardRef(() => StoreModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => BillModule),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService]
})
export class EvaluationModule {}
