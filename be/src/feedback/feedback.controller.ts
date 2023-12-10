import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Request } from 'express';
import { Feedback } from './schema/feedback.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { CheckAbilities, CreateFeedBackAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { RoleName } from '../role/schema/role.schema';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { UserService } from '../user/user.service';
import { SuccessResponse } from '../core/success.response';

@Controller('feedback')
@ApiTags('FeedBack')
@ApiBearerAuth('Authorization')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly userService: UserService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateFeedBackAbility())
  @CheckRole(RoleName.USER)
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Post('user')
  async create(
    @Query('productId') productId: string,
    @Body() feedback: CreateFeedbackDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse> {
    const newFeedback = await this.feedbackService.create(userId, productId, feedback)
    await this.userService.updateWallet(userId, 5000, "plus")
    return new SuccessResponse({
      message: "Đánh giá thành công!",
      metadata: { data: newFeedback },
    })
  }

}
