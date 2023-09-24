import { Body, Controller, Param, Post, Delete, Get, UseGuards, Request } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from './schema/role.schema';
import { CheckAbilities, CreateRoleAbility, ReadRoleAbility, UpdateRoleAbility } from 'src/ability/decorators/abilities.decorator';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { JwtATAuthGuard } from 'src/auth/guards/jwt-at-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth('Authorization')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateRoleAbility())
  @Post('addUserToRole/:userId')
  async addUserToRole(
    @Param('userId') userId: string,
    @Body() roleName: CreateRoleDto
  ): Promise<boolean> {
    const result = await this.roleService.addUserToRole(userId, roleName)
    return result
  }

  @Delete('/:userId')
  async removeUserRole(
    @Param('userId') userId: string
  ): Promise<boolean> {
    const result = await this.roleService.removeUserRole(userId)
    return result
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadRoleAbility())
  @Get('/:userId')
  async getRoleNameByUserId(
    @Param('userId') userId: string,
  ): Promise<string> {
    const role = await this.roleService.getRoleNameByUserId(userId)
    return role
  }

}
