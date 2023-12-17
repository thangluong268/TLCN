import { Body, Controller, Delete, Get, Param, Patch, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, DeleteUserAbility, ReadUserAbility, UpdateUserAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { BillService } from '../bill/bill.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { RoleService } from '../role/role.service';
import { RoleName } from '../role/schema/role.schema';
import { Store } from '../store/schema/store.schema';
import { StoreService } from '../store/store.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('Authorization')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly billService: BillService,
    private readonly storeService: StoreService,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(id);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const billsOfUser = await this.billService.getAllByUserId(id);

    const totalBills = billsOfUser.length;
    const totalPricePaid = billsOfUser.reduce((total, bill) => total + bill.totalPrice, 0);
    const totalReceived = billsOfUser.filter(bill => bill.totalPrice === 0).length;

    const data = {
      ...user.toObject(),
      totalBills,
      totalPricePaid,
      totalReceived,
    };

    return new SuccessResponse({
      message: 'Lấy thông tin người dùng thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @ApiQuery({ name: 'storeId', type: String, required: true })
  @Put('user-follow-store')
  async followStore(
    @Query('storeId') storeId: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException | BadRequestException> {
    const store: Store = await this.storeService.getById(storeId);

    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    if (store.userId.toString() === userId) return new BadRequestException('Bạn không thể theo dõi cửa hàng của chính mình!');

    await this.userService.followStore(userId, storeId);

    return new SuccessResponse({
      message: 'Follow cửa hàng thành công!',
      metadata: { data: {} },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @ApiQuery({ name: 'userIdReceive', type: String, required: true })
  @Put('user-add-friend')
  async addFriend(
    @Query('userIdReceive') userIdReceive: string,
    @GetCurrentUserId() userIdSend: string,
  ): Promise<SuccessResponse | NotFoundException | BadRequestException> {
    const user: User = await this.userService.getById(userIdReceive);

    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    if (userIdReceive === userIdSend) return new BadRequestException('Bạn không thể kết bạn với chính mình!');

    await this.userService.addFriend(userIdSend, userIdReceive);

    return new SuccessResponse({
      message: 'Follow cửa hàng thành công!',
      metadata: { data: {} },
    });
  }

  // Delete user
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteUserAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Delete('user/:id')
  async delete(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.delete(id);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');
    return new SuccessResponse({
      message: 'Xóa người dùng thành công!',
      metadata: { data: user },
    });
  }

  //Add warningCount for user by id
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/warningcount/:id')
  async updateWarningCount(@Param('id') id: string, @Param('action') action: string): Promise<SuccessResponse | BadRequestException> {
    const user = await this.userService.updateWarningCount(id, action);
    if (!user) return new BadRequestException('Không thể cập nhật số lần vi phạm!');
    return new SuccessResponse({
      message: 'Cập nhật số lần vi phạm thành công!',
      metadata: { data: user },
    });
  }

  // api/user/admin?page=1&limit=1&search=(Họ tên, email)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @CheckRole(RoleName.ADMIN)
  @Get('admin')
  async getAll(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string): Promise<SuccessResponse> {
    const data = await this.userService.getAll(page, limit, search);
    return new SuccessResponse({
      message: 'Lấy danh sách người dùng thành công!',
      metadata: { data },
    });
  }

  // Update user
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Patch('user/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {
    const currentUserRole = await this.roleService.getRoleNameByUserId(userId);

    if (currentUserRole.includes(RoleName.USER) && id !== userId) {
      return new ForbiddenException('Bạn không có quyền cập nhật thông tin người dùng khác!');
    }

    const updatedUser = await this.userService.update(id, updateUserDto);

    return new SuccessResponse({
      message: 'Cập nhật thông tin người dùng thành công!',
      metadata: { data: updatedUser },
    });
  }
}
