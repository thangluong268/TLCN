import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { CheckAbilities, UpdateEvaluationAbility } from '../ability/decorators/abilities.decorator';
import { BodyDto } from './dto/body.dto';
import { CheckRole } from '../ability/decorators/role.decorator';
import { RoleName } from '../role/schema/role.schema';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { StoreService } from '../store/store.service';

@Controller('evaluation')
@ApiTags('Evaluation')
@ApiBearerAuth('Authorization')
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateEvaluationAbility())
  @CheckRole(RoleName.USER)
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Put('user')
  async create(
    @Query('productId') productId: string,
    @Body() body: BodyDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const user = await this.userService.getById(userId)
    if (!user) return new NotFoundException("Không tìm thấy người dùng này!")

    const product = await this.productService.getById(productId)
    if (!product) return new NotFoundException("Không tìm thấy sản phẩm này!")

    const store = await this.storeService.getById(product.storeId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const hadEvaluation = await this.evaluationService.checkEvaluationByUserIdAndProductId(userId, productId)

    const result = await this.evaluationService.update(userId, productId, body.body)

    console.log(result)

    if (!result) return new NotFoundException("Không tìm thấy sản phẩm này!")

    if (userId !== store.userId && !hadEvaluation) {
      const createNotiData: CreateNotificationDto = {
        userIdFrom: userId,
        userIdTo: store.userId,
        content: "đã bày tỏ cảm xúc về sản phẩm của bạn!",
        type: body.body,
        sub: {
          fullName: user.fullName,
          avatar: user.avatar,
          productId: productId.toString(),
        }
      }
      await this.notificationService.create(createNotiData)
    }

    return new SuccessResponse({
      message: "Đánh giá thành công!",
      metadata: { data: result },
    })
  }


  @Public()
  @ApiQuery({ name: 'productId', type: String, required: true })
  @ApiQuery({ name: 'userId', type: String, required: false })
  @Get()
  async getByProductId(
    @Query('productId') productId: string,
    @Query('userId') userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const evaluation = await this.evaluationService.getByProductId(productId)
    if (!evaluation) return new NotFoundException("Không tìm thấy sản phẩm này!")

    const total: number = evaluation.emojis.length

    const emoji = {
      Haha: 0,
      Love: 0,
      Wow: 0,
      Sad: 0,
      Angry: 0,
      like: 0,
    }

    evaluation.emojis.forEach(e => {
      switch (e.name) {
        case "Haha": emoji.Haha++; break;
        case "Love": emoji.Love++; break;
        case "Wow": emoji.Wow++; break;
        case "Sad": emoji.Sad++; break;
        case "Angry": emoji.Angry++; break;
        case "like": emoji.like++; break;
      }
    })

    let isReaction = false

    if (userId) {
      let evaluationOfUser = evaluation.emojis.find(emoji => emoji.userId.toString() === userId.toString())
      evaluationOfUser ? isReaction = true : isReaction = false
    }

    const data = {
      total,
      haha: emoji.Haha,
      love: emoji.Love,
      wow: emoji.Wow,
      sad: emoji.Sad,
      angry: emoji.Angry,
      like: emoji.like,
      isReaction,
    }

    return new SuccessResponse({
      message: "Lấy danh sách đánh giá thành công!",
      metadata: { data },
    })
  }
}