import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, CreateFeedBackAbility, UpdateFeedBackAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { BadRequestException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { RoleName } from '../role/schema/role.schema';
import { StoreService } from '../store/store.service';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackDto } from './dto/feedback.dto';
import { FeedbackService } from './feedback.service';
import { Feedback } from './schema/feedback.schema';

@Controller()
@ApiTags('FeedBack')
@ApiBearerAuth('Authorization')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateFeedBackAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Post('feedback/user')
  async create(
    @Query('productId') productId: string,
    @Body() feedback: CreateFeedbackDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse> {
    const product = await this.productService.getById(productId);

    const store = await this.storeService.getById(product.storeId);

    const userSend = await this.userService.getById(userId);

    const userReceive = await this.userService.getById(store.userId);

    const newFeedback = await this.feedbackService.create(userId, productId, feedback);

    await this.userService.updateWallet(userId, 5000, 'plus');

    const createNotiData: CreateNotificationDto = {
      userIdFrom: userId,
      userIdTo: userReceive._id.toString(),
      content: 'đã đánh giá sản phẩm của bạn.',
      type: 'Đánh giá',
      sub: {
        fullName: userSend.fullName,
        avatar: userSend.avatar,
        productId,
      },
    };
    await this.notificationService.create(createNotiData);

    return new SuccessResponse({
      message: 'Đánh giá thành công!',
      metadata: { data: newFeedback },
    });
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
    const feedbacks = await this.feedbackService.getAllByProductIdPaging(page, limit, productId);

    const data: FeedbackDto[] = await Promise.all(
      feedbacks.feedbacks.map(async (feedback: Feedback) => {
        const user: User = await this.userService.getById(feedback.userId);

        return {
          star: feedback.star,
          content: feedback.content,
          avatar: user.avatar,
          name: user.fullName,
          consensus: feedback.consensus,
          isConsensus: false,
          createdAt: feedback['createdAt'],
          userId: feedback.userId,
        };
      }),
    );

    if (userId) {
      data.forEach((feedback: FeedbackDto) => {
        if (feedback.consensus.includes(userId)) {
          feedback.isConsensus = true;
        }
      });
    }

    return new SuccessResponse({
      message: 'Lấy danh sách đánh giá thành công!',
      metadata: { total: feedbacks.total, data },
    });
  }

  @Public()
  @Get('feedback-count-total')
  @ApiQuery({ name: 'productId', type: String, required: true })
  async countTotal(@Query('productId') productId: string): Promise<SuccessResponse> {
    const total = await this.feedbackService.countTotal(productId);

    return new SuccessResponse({
      message: 'Lấy tổng số lượng đánh giá thành công!',
      metadata: { total },
    });
  }

  @Public()
  @Get('feedback-star')
  @ApiQuery({ name: 'productId', type: String, required: true })
  async getAllByProductIdStar(@Query('productId') productId: string): Promise<SuccessResponse> {
    const feedbacks: Feedback[] = await this.feedbackService.getAllByProductId(productId);

    const star = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    const startPercent = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (feedbacks.length === 0)
      return new SuccessResponse({
        message: 'Lấy danh sách đánh giá sao thành công!',
        metadata: { startPercent, averageStar: 0 },
      });

    feedbacks.forEach(feedback => {
      star[feedback.star]++;
    });

    Object.keys(star).forEach(key => {
      startPercent[key] = Math.round((star[key] / feedbacks.length) * 100);
    });

    let averageStar = 0;
    Object.keys(star).forEach(key => {
      averageStar += star[key] * Number(key);
    });

    averageStar = Number((averageStar / feedbacks.length).toFixed(2));

    return new SuccessResponse({
      message: 'Lấy danh sách đánh giá sao thành công!',
      metadata: { startPercent, averageStar },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateFeedBackAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @ApiQuery({ name: 'userId', type: String, required: true })
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Put('feedback-consensus')
  async updateConsensus(
    @Query('userId') userId: string,
    @Query('productId') productId: string,
    @GetCurrentUserId() userIdConsensus: string,
  ): Promise<SuccessResponse | NotFoundException | BadRequestException> {
    if (userId === userIdConsensus) return new BadRequestException('Bạn không thể đồng thuận với chính mình!');

    const userSend = await this.userService.getById(userIdConsensus);

    const feedback: Feedback = await this.feedbackService.updateConsensus(userId, productId, userIdConsensus);

    if (!feedback) return new NotFoundException('Không tìm thấy đánh giá này!');

    const consensus = feedback.consensus.find(id => id.toString() === userIdConsensus.toString());

    if (consensus) {
      const createNotiData: CreateNotificationDto = {
        userIdFrom: userIdConsensus,
        userIdTo: userId,
        content: 'đã đồng thuận về đánh giá của bạn.',
        type: 'Đồng thuận',
        sub: {
          fullName: userSend.fullName,
          avatar: userSend.avatar,
          productId,
        },
      };
      await this.notificationService.create(createNotiData);
    }

    return new SuccessResponse({
      message: 'Đồng thuận thành công!',
      metadata: { data: {} },
    });
  }
}
