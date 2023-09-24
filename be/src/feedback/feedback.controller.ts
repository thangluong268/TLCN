import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Request } from 'express';
import { Feedback } from './schema/feedback.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Types } from 'mongoose';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateFeedBackAbility } from 'src/ability/decorators/abilities.decorator';

@Controller('feedback')
@ApiTags('FeedBack')
@ApiBearerAuth('Authorization')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService
    ) {}

    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new CreateFeedBackAbility())
    @ApiQuery({ name: 'productId', type: String, required: true })
    @Post('user')
    async create(
      @Req() req: Request,
      @Query('productId') productId: string,
      @Body() feedback: CreateFeedbackDto,
    ) : Promise<Feedback> {
      const userId = req.user['userId']
      const newFeedback = await this.feedbackService.create(userId, productId, feedback)
      return newFeedback
    }

}
