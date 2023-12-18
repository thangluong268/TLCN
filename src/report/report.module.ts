import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { NotificationModule } from '../notification/notification.module';
import { ReportSchema } from './schema/report.schema';
import { ProductModule } from '../product/product.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';

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
})
export class ReportModule {}
