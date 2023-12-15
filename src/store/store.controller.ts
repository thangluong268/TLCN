import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CheckAbilities,
  CreateStoreAbility,
  DeleteStoreAbility,
  ReadStoreAbility,
  UpdateStoreAbility,
} from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { BadRequestException, ConflicException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { FeedbackService } from '../feedback/feedback.service';
import { Feedback } from '../feedback/schema/feedback.schema';
import { ProductService } from '../product/product.service';
import { RoleService } from '../role/role.service';
import { RoleName } from '../role/schema/role.schema';
import { UserService } from '../user/user.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './store.service';

@Controller()
@ApiTags('Store')
@ApiBearerAuth('Authorization')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly feedbackService: FeedbackService,
    private readonly productService: ProductService,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateStoreAbility())
  @CheckRole(RoleName.USER)
  @Post('store/user')
  async create(
    @Body() store: CreateStoreDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException | ConflicException | BadRequestException> {
    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const hasStore = await this.storeService.getByUserId(userId);
    if (hasStore) return new ConflicException('Người dùng này đã có cửa hàng!');

    const newStore = await this.storeService.create(userId, store);
    if (!newStore) return new BadRequestException('Tạo cửa hàng thất bại!');

    const resultAddRole = await this.roleService.addUserToRole(userId, { name: RoleName.SELLER });
    if (!resultAddRole) return new BadRequestException('Thêm quyền thất bại!');

    return new SuccessResponse({
      message: 'Tạo cửa hàng thành công!',
      metadata: { data: newStore },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadStoreAbility())
  @CheckRole(RoleName.SELLER, RoleName.USER)
  @Get('store/seller')
  async getMyStore(@GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getByUserId(userId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    return new SuccessResponse({
      message: 'Lấy thông tin cửa hàng thành công!',
      metadata: { data: store },
    });
  }

  @Public()
  @ApiQuery({ name: 'storeId', type: String, required: true })
  @Get('store-reputation')
  async getReputation(@Query('storeId') storeId: string): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getById(storeId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    const products = await this.productService.getProductsByStoreId(storeId);

    let totalFeedback = 0;

    let totalProductsHasFeedback = 0;
    let totalAverageStar = 0;

    let averageStar = 0;

    await Promise.all(
      products.map(async product => {
        const feedbacks: Feedback[] = await this.feedbackService.getAllByProductId(product._id);

        if (feedbacks.length === 0) return;

        totalFeedback += feedbacks.length;

        const star = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        feedbacks.forEach(feedback => {
          star[feedback.star]++;
        });

        let averageStar = 0;

        Object.keys(star).forEach(key => {
          averageStar += star[key] * Number(key);
        });

        averageStar = Number((averageStar / feedbacks.length).toFixed(2));

        totalAverageStar += averageStar;

        totalProductsHasFeedback++;
      }),
    );

    if (totalProductsHasFeedback !== 0) averageStar = Number((totalAverageStar / totalProductsHasFeedback).toFixed(2));

    const totalFollow = await this.userService.countTotalFollowStoresByStoreId(storeId);

    return new SuccessResponse({
      message: 'Lấy thông tin độ uy tín cửa hàng thành công!',
      metadata: { averageStar, totalFeedback, totalFollow },
    });
  }

  @Public()
  @Get('store/:id')
  async getById(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getById(id);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    delete store.__v;

    return new SuccessResponse({
      message: 'Lấy thông tin cửa hàng thành công!',
      metadata: { data: store },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteStoreAbility())
  @CheckRole(RoleName.SELLER)
  @Delete('store/seller')
  async delete(@GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException | BadRequestException> {
    const result = await this.storeService.delete(userId);
    if (!result) return new NotFoundException('Không tìm thấy cửa hàng này!');
    const isDeleted = await this.roleService.removeUserRole(userId, RoleName.SELLER);
    if (!isDeleted) return new BadRequestException('Xóa quyền thất bại!');
    return new SuccessResponse({
      message: 'Xóa cửa hàng thành công!',
      metadata: { data: result },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateStoreAbility())
  @CheckRole(RoleName.SELLER)
  @Put('store/seller')
  async update(@Body() store: UpdateStoreDto, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const newStore = await this.storeService.update(userId, store);
    if (!newStore) return new NotFoundException('Không tìm thấy cửa hàng này!');
    return new SuccessResponse({
      message: 'Cập nhật thông tin cửa hàng thành công!',
      metadata: { data: newStore },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateStoreAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('store/manager/warningcount/:id')
  async updateWarningCount(@Param('id') id: string, @Param('action') action: string): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.updateWarningCount(id, action);
    if (!store) throw new NotFoundException('Không tìm thấy cửa hàng này!');
    return new SuccessResponse({
      message: 'Cập nhật cảnh báo thành công!',
      metadata: { data: store },
    });
  }
}
