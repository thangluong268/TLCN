import { Module } from '@nestjs/common';
import { FineService } from './fine.service';
import { FineController } from './fine.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { RoleModule } from '../role/role.module';
import { FineSchema } from './schema/fine.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Fine', schema: FineSchema }]),
    AbilityModule,
    RoleModule,
  ],
  controllers: [FineController],
  providers: [FineService],
})
export class FineModule { }
