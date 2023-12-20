import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, ReadNotificationAbility, UpdateNotificationAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { RoleName } from '../role/schema/role.schema';
import { UserService } from '../user/user.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('Notification')
@ApiBearerAuth('Authorization')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadNotificationAbility())
  @CheckRole(RoleName.ADMIN, RoleName.USER)
  @Post()
  async create(@Body() notification: CreateNotificationDto): Promise<SuccessResponse> {
    const newNotification = await this.notificationService.create(notification);
    return new SuccessResponse({
      message: 'Tạo thông báo thành công!',
      metadata: { data: newNotification },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadNotificationAbility())
  @CheckRole(RoleName.SELLER, RoleName.USER, RoleName.ADMIN)
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getAllByUserId(@Query('page') page: number, @Query('limit') limit: number, @GetCurrentUserId() userId: string): Promise<SuccessResponse> {
    const data = await this.notificationService.getAllByUserId(userId, page, limit);
    return new SuccessResponse({
      message: 'Lấy danh sách thông báo thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateNotificationAbility())
  @CheckRole(RoleName.SELLER, RoleName.USER, RoleName.ADMIN)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateNoti: UpdateNotificationDto): Promise<SuccessResponse | NotFoundException> {
    const result = await this.notificationService.update(id, updateNoti);
    if (!result) return new NotFoundException('Không tìm thấy thông báo này!');
    return new SuccessResponse({
      message: 'Cập nhật thông báo thành công!',
      metadata: { data: result },
    });
  }
}
