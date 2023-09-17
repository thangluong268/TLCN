import { Module } from '@nestjs/common';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicySchema } from './schema/policy.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Policy', schema: PolicySchema}]),
    ConfigModule,
  ],
  controllers: [PolicyController],
  providers: [PolicyService]
})
export class PolicyModule {}
