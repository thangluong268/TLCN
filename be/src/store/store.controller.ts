import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './schema/store.schema';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateBillAbility, CreateStoreAbility, ReadStoreAbility } from 'src/ability/decorators/abilities.decorator';
import { Types } from 'mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UserService } from 'src/user/user.service';

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
    const userId = new Types.ObjectId(req.user['userId'])
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
    const idObjId = new Types.ObjectId(id)
    const store = await this.storeService.getById(idObjId)
    return store
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadStoreAbility())
  @Get('seller')
  async getMyStore(
    @Req() req: Request
  ): Promise<Store> {
    const userId = new Types.ObjectId(req.user['userId'])
    const store = await this.storeService.getByUserId(userId)
    return store
  }

}



