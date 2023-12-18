import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, CreateReportAbility, ReadReportAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { RoleService } from '../role/role.service';
import { RoleName } from '../role/schema/role.schema';
import { StoreService } from '../store/store.service';
import { UserService } from '../user/user.service';
import { CreateReportDto } from './dto/report.dto';
import { ReportService } from './report.service';
import { Notification } from '../notification/schema/notification.schema';

@Controller()
@ApiTags('Report')
@ApiBearerAuth('Authorization')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateReportAbility())
  @CheckRole(RoleName.USER)
  @Post('report/user')
  async create(@Body() createReportDto: CreateReportDto, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.getById(createReportDto.productId);
    if (!product) return new NotFoundException('Không tìm thấy sản phẩm này!');

    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const newReport = await this.reportService.create(createReportDto, userId);

    // Gửi thông báo cho người bán
    const store = await this.storeService.getById(product.storeId);
    const createNotiDataToSeller: CreateNotificationDto = {
      userIdFrom: userId,
      userIdTo: store.userId,
      content: `đã báo cáo sản phẩm của bạn. Mã sản phẩm: #${createReportDto.productId}.`,
      type: 'Báo cáo',
      sub: {
        fullName: user.fullName,
        avatar: user.avatar,
        productId: createReportDto.productId,
      },
    };
    await this.notificationService.create(createNotiDataToSeller);

    // Gửi thông báo cho quản lý cửa hàng
    const managerStoreIds: string[] = await this.roleService.getAllManagerStoreIds();

    const notificationPromises: Promise<Notification>[] = [];

    for (const managerStoreId of managerStoreIds) {
      const notificationPromise = this.notificationService.create({
        userIdFrom: userId,
        userIdTo: managerStoreId,
        content: `đã báo cáo sản phẩm. Mã sản phẩm: #${createReportDto.productId}.`,
        type: 'Báo cáo',
        sub: {
          fullName: user.fullName,
          avatar: user.avatar,
          productId: createReportDto.productId,
        },
      });

      notificationPromises.push(notificationPromise);
    }
    await Promise.all(notificationPromises);

    return new SuccessResponse({
      message: 'Tạo báo cáo thành công!',
      metadata: { data: newReport },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadReportAbility())
  @CheckRole(RoleName.ADMIN, RoleName.MANAGER_PRODUCT)
  @Get('report/admin')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAllBySearchPublic(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string): Promise<SuccessResponse> {
    const data = await this.productService.getAllBySearch(null, page, limit, search, null, null, {});
    return new SuccessResponse({
      message: 'Lấy danh sách sản phẩm thành công!',
      metadata: { data },
    });
  }
}
