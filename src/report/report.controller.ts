import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, CreateReportAbility, ReadReportAbility, UpdateReportAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { BadRequestException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/schema/notification.schema';
import { ProductService } from '../product/product.service';
import { Product } from '../product/schema/product.schema';
import { RoleService } from '../role/role.service';
import { RoleName } from '../role/schema/role.schema';
import { Store } from '../store/schema/store.schema';
import { StoreService } from '../store/store.service';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { CreateReportDto } from './dto/report.dto';
import { ReportService } from './report.service';

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
  async create(
    @Body() createReportDto: CreateReportDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException | BadRequestException> {
    const product = await this.productService.getById(createReportDto.productId);
    if (!product) return new NotFoundException('Không tìm thấy sản phẩm này!');

    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const hasReport = await this.reportService.getByProductIdAndUserId(createReportDto.productId, userId);
    if (hasReport) return new BadRequestException('Bạn đã báo cáo sản phẩm này rồi!');

    const newReport = await this.reportService.create(createReportDto, userId);

    const store = await this.storeService.getById(product.storeId);

    // Gửi thông báo cho người bán
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
  async getAllBySearch(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string): Promise<SuccessResponse> {
    const data = await this.reportService.getAllBySearch(page, limit, search);

    return new SuccessResponse({
      message: 'Lấy danh sách báo cáo thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadReportAbility())
  @CheckRole(RoleName.ADMIN, RoleName.MANAGER_PRODUCT)
  @Get('report/admin/:id')
  async getById(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const report = await this.reportService.getById(id);
    if (!report) return new NotFoundException('Không tìm thấy báo cáo này!');

    const userReport: User = await this.userService.getById(report.userId);

    const product: Product = await this.productService.getById(report.productId);

    const store: Store = await this.storeService.getById(product.storeId);

    const data = {
      report: {
        _id: report._id,
        content: report.content,
        status: report.status,
        createdAt: report['createdAt'],
      },

      userReport: {
        _id: userReport._id,
        fullName: userReport.fullName,
        email: userReport.email,
        avatar: userReport.avatar,
        gender: userReport.gender,
      },

      product,
      store,
    };

    return new SuccessResponse({
      message: 'Lấy thông tin báo cáo thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateReportAbility())
  @CheckRole(RoleName.ADMIN, RoleName.MANAGER_PRODUCT)
  @Put('report/admin/:id')
  async updateStatus(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const report = await this.reportService.getById(id);
    if (!report) return new NotFoundException('Không tìm thấy báo cáo này!');

    await this.reportService.updateStatus(id);

    const numOfReport = await this.reportService.countByProductId(report.productId);

    if (numOfReport === 5) {
      const product = await this.productService.getById(report.productId);
      const store = await this.storeService.getById(product.storeId);
      const seller = await this.userService.getById(store.userId);
      await this.productService.update(report.productId, { status: false });
      await this.storeService.updateWarningCount(store._id, store.warningCount, seller.email);
    }

    return new SuccessResponse({
      message: 'Giải quyết báo cáo thành công!',
      metadata: { data: {} },
    });
  }
}
