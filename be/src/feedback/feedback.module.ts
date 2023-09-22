import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { FeedbackSchema } from './schema/feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema }]),
    AbilityModule,
    RoleModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
