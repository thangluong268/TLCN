import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ACTION_CART, AddCartGateway, UpdateCartGateway } from './gateway/action-cart.gateway';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateCartAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import mongoose, { Types } from 'mongoose';
import { CreateCartDto } from './dto/cart-create.dto';
import { Cart } from './schema/cart.schema';
import { UpdateCartDto } from './dto/cart-update.dto';

@Controller('cart/user')
@ApiTags('Cart')
@ApiBearerAuth('Authorization')
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) {
    this.cartService.registerActionGateway(ACTION_CART.ADD, new AddCartGateway(this.cartService))
    this.cartService.registerActionGateway(ACTION_CART.UPDATE, new UpdateCartGateway(this.cartService))
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateCartAbility())
  @Post()
  @ApiQuery({ name: 'storeId', type: String, required: true })
  @ApiQuery({ name: 'action', type: String, required: true })
  async processCart(
    @Req() req: Request,
    @Query('storeId') storeId: string,
    @Query('action') action: ACTION_CART,
    @Body() cart: CreateCartDto,
  ): Promise<Cart | boolean> {
    const userId = new Types.ObjectId(req.user['userId'])
    const storeObjId = new Types.ObjectId(storeId)
    const result = await this.cartService.processAction(userId, cart, storeObjId, action)
    return result
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateCartAbility())
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getByUserId(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string
  ): Promise<{total: number, carts: Cart[]}> {
    const userId = new Types.ObjectId(req.user['userId'])
    const data = await this.cartService.getByUserId(userId, page, limit, search)
    return data
  }

}
