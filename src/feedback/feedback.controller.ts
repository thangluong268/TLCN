import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
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
import { Public } from '../auth/decorators/public.decorator';
import { FeedbackDto } from './dto/feedback.dto';
import { User } from '../user/schema/user.schema';

@Controller()
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
  @Post('feedback/user')
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

  @Public()
  @Get('feedback')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'productId', type: String, required: true })
  @ApiQuery({ name: 'userId', type: String, required: false })
  async getAllByProductIdPaging(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('productId') productId: string,
    @Query('userId') userId: string,
  ): Promise<SuccessResponse> {

    const feedbacks = await this.feedbackService.getAllByProductIdPaging(page, limit, productId)

    const data: FeedbackDto[] = await Promise.all(feedbacks.feedbacks.map(async (feedback: Feedback) => {

      let user: User = await this.userService.getById(feedback.userId)

      return {
        star: feedback.star,
        content: feedback.content,
        avatar: user.avatar,
        name: user.fullName,
        consensus: feedback.consensus,
        isConsensus: false
      }
    }))

    if (userId) {
      data.forEach((feedback: FeedbackDto) => {
        if (feedback.consensus.includes(userId)) {
          feedback.isConsensus = true
        }
      })
    }

    return new SuccessResponse({
      message: "Lấy danh sách đánh giá thành công!",
      metadata: { total: feedbacks.total, data },
    })
  }

  @Public()
  @Get('feedback-star')
  @ApiQuery({ name: 'productId', type: String, required: true })
  async getAllByProductIdStar(
    @Query('productId') productId: string,
  ): Promise<SuccessResponse> {

    const feedbacks: Feedback[] = await this.feedbackService.getAllByProductId(productId)

    const star = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    const startPercent = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    if (feedbacks.length === 0) return new SuccessResponse({
      message: "Lấy danh sách đánh giá sao thành công!",
      metadata: { startPercent, averageStar: 0 },
    })

    feedbacks.forEach(feedback => {
      star[feedback.star]++
    })

    Object.keys(star).forEach(key => {
      startPercent[key] = Math.round((star[key] / feedbacks.length) * 100)
    })

    let averageStar = 0
    Object.keys(star).forEach(key => {
      averageStar += star[key] * Number(key)
    })

    averageStar = Number((averageStar / feedbacks.length).toFixed(2))

    return new SuccessResponse({
      message: "Lấy danh sách đánh giá sao thành công!",
      metadata: { startPercent, averageStar },
    })
  }

}
