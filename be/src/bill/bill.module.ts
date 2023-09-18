import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillSchema } from './schema/bill.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bill', schema: BillSchema }]),
    AbilityModule,
    RoleModule,
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
