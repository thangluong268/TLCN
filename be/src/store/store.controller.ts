import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './schema/store.schema';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateBillAbility, CreateStoreAbility, ReadStoreAbility, UpdateStoreAbility } from 'src/ability/decorators/abilities.decorator';
import { Types } from 'mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UserService } from 'src/user/user.service';
import { Role, RoleName } from 'src/role/schema/role.schema';
import { CheckRole } from 'src/ability/decorators/role.decorator';

@Controller('store')
@ApiTags('Store')
@ApiBearerAuth('Authorization')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateStoreAbility())
  @Post('user')
  async create(
    @Req() req: Request,
    @Body() store: CreateStoreDto
  ): Promise<Store> {
    const userId = req.user['userId']
    const user = await this.userService.getById(userId)
    const newStore = await this.storeService.create(userId, user.phone, store)
    return newStore
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadStoreAbility())
  @Get('user/:id')
  async getById(
    @Param('id') id: string
  ): Promise<Store> {
    const store = await this.storeService.getById(id)
    return store
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadStoreAbility())
  @Get('seller')
  async getMyStore(
    @Req() req: Request
  ): Promise<Store> {
    const userId = req.user['userId']
    const store = await this.storeService.getByUserId(userId)
    return store
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateStoreAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/warningcount/:id')
  async updateWarningCount(@Param('id') id: string, @Param("action") action: string): Promise<Store> {
    const store = await this.storeService.updateWarningCount(id, action);
    return store
  }
}



