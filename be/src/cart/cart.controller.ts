import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateCartAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import mongoose, { Types } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { ProductService } from 'src/product/product.service';

@Controller('cart/user')
@ApiTags('Cart')
@ApiBearerAuth('Authorization')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateCartAbility())
  @Post()
  @ApiQuery({ name: 'productId', type: String, required: true })
  async processCart(
    @Req() req: Request,
    @Query('productId') productId: string
  ): Promise<Cart> {
    const userId = req.user['userId']
    const product = await this.productService.getById(productId)
    const result = await this.cartService.addProductIntoCart(userId, product)
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
  ): Promise<{ total: number, carts: Cart[] }> {
    const userId = req.user['userId']
    const data = await this.cartService.getByUserId(userId, page, limit, search)
    return data
  }

}
