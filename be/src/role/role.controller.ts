import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, ReadRoleAbility, UpdateRoleAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { BadRequestException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { RoleName } from './schema/role.schema';

@Controller('role/admin')
@ApiTags('Role')
@ApiBearerAuth('Authorization')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateRoleAbility())
  @CheckRole(RoleName.ADMIN)
  @Post('addUserToRole')
  @ApiQuery({ name: 'userId', type: String, required: true })
  async addUserToRole(@Query('userId') userId: string, @Body() roleName: CreateRoleDto): Promise<SuccessResponse | BadRequestException> {
    const result = await this.roleService.addUserToRole(userId, roleName);
    if (!result) return new BadRequestException('Thêm quyền thất bại!');
    return new SuccessResponse({
      message: 'Thêm quyền thành công!',
      metadata: { data: result },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateRoleAbility())
  @CheckRole(RoleName.ADMIN)
  @Delete('removeUserRole')
  @ApiQuery({ name: 'userId', type: String, required: true })
  @ApiQuery({ name: 'roleName', type: String, required: true })
  async removeUserRole(@Query('userId') userId: string, @Query('roleName') roleName: string): Promise<SuccessResponse | NotFoundException> {
    const result = await this.roleService.removeUserRole(userId, roleName);
    if (!result) return new NotFoundException('Không tìm thấy quyền này!');
    return new SuccessResponse({
      message: 'Xóa quyền thành công!',
      metadata: { data: result },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadRoleAbility())
  @CheckRole(RoleName.ADMIN, RoleName.MANAGER_USER)
  @Get('getRoleNameByUserId')
  @ApiQuery({ name: 'userId', type: String, required: true })
  async getRoleNameByUserId(@Query('userId') userId: string): Promise<SuccessResponse | NotFoundException> {
    const role = await this.roleService.getRoleNameByUserId(userId);
    if (!role) return new NotFoundException('Không tìm thấy quyền này!');
    return new SuccessResponse({
      message: 'Lấy quyền thành công!',
      metadata: { data: role },
    });
  }
}
