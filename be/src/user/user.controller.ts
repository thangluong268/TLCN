import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, ReadUserAbility } from 'src/ability/decorators/abilities.decorator';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { User } from './schema/user.schema';
import { RoleService } from 'src/role/role.service';
import { Types } from 'mongoose';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddIdDto } from './dto/add-friend-store.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('Authorization')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly roleService: RoleService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getById(id);
    return user
  }

  // Update user
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @Put('user/:id')
  async update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userService.update(new Types.ObjectId(id), UpdateUserDto);
    return user
  }

  // Delete user
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @Delete('user/:id')
  async delete(@Param('id') id: string): Promise<User> {
    const user = await this.userService.delete(new Types.ObjectId(id));
    return user
  }

  // Add userId to listFriends
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @Post('user/addFriend/:id')
  async addFriend(@Param('id') id: string, @Body() req: AddIdDto): Promise<User> {
    const me = await this.userService.addFriend(new Types.ObjectId(id), new Types.ObjectId(req.id));
    const myfriend = await this.userService.addFriend(new Types.ObjectId(req.id), new Types.ObjectId(id));
    return me
  }

  // Remove userId from listFriends
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @Post('user/unFriend/:id')
  async unFriend(@Param('id') id: string, @Body() req: AddIdDto): Promise<User> {
    const me = await this.userService.unFriend(new Types.ObjectId(id), new Types.ObjectId(req.id));
    const myfriend = await this.userService.unFriend(new Types.ObjectId(req.id), new Types.ObjectId(id));
    return me
  }

  //Add storeId to listStore
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @Post('user/followStore/:id')
  async addStore(@Param('id') id: string, @Body() req: AddIdDto): Promise<User> {
    const user = await this.userService.followStore(new Types.ObjectId(id), new Types.ObjectId(req.id));
    return user
  }

  //Remove storeId from listStore
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @Post('user/unFollowStore/:id')
  async unFollowStore(@Param('id') id: string, @Body() req: AddIdDto): Promise<User> {
    const user = await this.userService.unFollowStore(new Types.ObjectId(id), new Types.ObjectId(req.id));
    return user
  }

  //Add warningCount for user by id
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @Post('manager/warningcount/:id')
  async plusWarningCount(@Param('id') id: string): Promise<User> {
    const user = await this.userService.plusWarningCount(new Types.ObjectId(id));
    return user
  }


}
