import { Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, CreateCartAbility, ReadCartAbility, UpdateCartAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { InternalServerErrorException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { ProductService } from '../product/product.service';
import { RoleName } from '../role/schema/role.schema';
import { StoreService } from '../store/store.service';
import { CartService } from './cart.service';
import { Cart } from './schema/cart.schema';

@Controller('cart/user')
@ApiTags('Cart')
@ApiBearerAuth('Authorization')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateCartAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Post()
  @ApiQuery({ name: 'productId', type: String, required: true })
  async processCart(@Query('productId') productId: string, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.getById(productId);
    if (!product) return new NotFoundException('Không tìm thấy sản phẩm này!');

    const store = await this.storeService.getById(product.storeId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    const result = await this.cartService.addProductIntoCart(userId, store, product);
    if (!result) return new InternalServerErrorException('Không thêm sản phẩm vào giỏ hàng được!');

    return new SuccessResponse({
      message: 'Thêm sản phẩm vào giỏ hàng thành công!',
      metadata: { data: result },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadCartAbility())
  @CheckRole(RoleName.USER)
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getByUserId(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse> {
    const data = await this.cartService.getByUserId(userId, page, limit, search);
    return new SuccessResponse({
      message: 'Lấy danh sách giỏ hàng thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadCartAbility())
  @CheckRole(RoleName.USER)
  @Get('/get-all')
  async getAllByUserId(@GetCurrentUserId() userId: string): Promise<SuccessResponse> {
    const data = await this.cartService.getAllByUserId(userId);
    return new SuccessResponse({
      message: 'Lấy danh sách giỏ hàng thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateCartAbility())
  @CheckRole(RoleName.USER)
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Delete()
  async removeProductInCart(@Query('productId') productId: string, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.getById(productId);
    if (!product) return new NotFoundException('Không tìm thấy sản phẩm này!');

    const store = await this.storeService.getById(product.storeId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    await this.cartService.removeProductInCart(userId, productId, store._id);

    return new SuccessResponse({
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công!',
      metadata: {},
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadCartAbility())
  @CheckRole(RoleName.USER)
  @Get('/get-new')
  async getNewCartByUserId(@GetCurrentUserId() userId: string): Promise<SuccessResponse> {
    const carts = await this.cartService.getAllByUserId(userId);

    const data: Cart = carts[0];

    return new SuccessResponse({
      message: 'Lấy giỏ hàng mới nhất thành công!',
      metadata: { data },
    });
  }
}
