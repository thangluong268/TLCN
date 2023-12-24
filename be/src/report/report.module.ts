import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { NotificationModule } from '../notification/notification.module';
import { ProductModule } from '../product/product.module';
import { RoleModule } from '../role/role.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportSchema } from './schema/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]),
    AbilityModule,
    RoleModule,
    NotificationModule,
    ProductModule,
    StoreModule,
    UserModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
