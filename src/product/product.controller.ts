import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { CheckAbilities, CreateProductAbility, DeleteProductAbility, ReadProductAbility, UpdateProductAbility } from '../ability/decorators/abilities.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { StoreService } from '../store/store.service';
import { EvaluationService } from '../evaluation/evaluation.service';
import { CheckRole } from '../ability/decorators/role.decorator';
import { RoleName } from '../role/schema/role.schema';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/schema/notification.schema';
import { ExcludeIds, FilterDate, FilterProduct, ProductDto } from './dto/product.dto';
import { Product } from './schema/product.schema';
import { BillService } from '../bill/bill.service';
import { PRODUCT_TYPE } from '../bill/schema/bill.schema';
import { CategoryService } from '../category/category.service';


@Controller()
@ApiTags('Product')
@ApiBearerAuth('Authorization')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly evaluationService: EvaluationService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly billService: BillService,
    private readonly categoryService: CategoryService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Post('product/seller')
  async create(
    @Body() product: CreateProductDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const category = await this.categoryService.getById(product.categoryId)
    if (!category) return new NotFoundException("Không tìm thấy danh mục này!")

    const newProduct = await this.productService.create(store._id, product)

    await this.evaluationService.create(newProduct._id)

    const userHasFollowStores = await this.userService.getFollowStoresByStoreId(store._id)

    const notificationPromises: Promise<Notification>[] = [];

    for (const user of userHasFollowStores) {
      if (userId === user._id) continue
  
      const notificationPromise = this.notificationService.create({
        userIdFrom: userId,
        userIdTo: user._id,
        content: `đã đăng sản phẩm mới. ${newProduct.productName}`,
        type: "Thêm sản phẩm",
        sub: {
          fullName: store.name,
          avatar: store.avatar,
          productId: newProduct._id.toString(),
        },
      })
  
      notificationPromises.push(notificationPromise)
    }
    await Promise.all(notificationPromises)

    return new SuccessResponse({
      message: "Tạo sản phẩm thành công!",
      metadata: { data: newProduct },
    })

  }

  // để tạo nhiều data một lúc (để test)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Post('product/sellerCreateMultiple')
  async sellerCreateMultiple(
    @Body() products: CreateProductDto[],
    @GetCurrentUserId() userId: string,
  ): Promise<void | NotFoundException> {
    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")
    products.forEach(async product => {
      const newProduct = await this.productService.create(store._id, product)
      await this.evaluationService.create(newProduct._id)
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadProductAbility())
  @CheckRole(RoleName.SELLER)
  @Get('product/seller')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'sortType', type: String, required: false })
  @ApiQuery({ name: 'sortValue', type: String, required: false })
  async getAllBySearch(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortType') sortType: string,
    @Query('sortValue') sortValue: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const products = await this.productService.getAllBySearch(store._id, page, limit, search, sortType, sortValue, {})

    const fullInfoProducts: ProductDto[] = await Promise.all(products.products.map(async (product: Product) => {
      let category = await this.categoryService.getById(product.categoryId);
      let quantitySold: number = await this.billService.countProductDelivered(product._id, PRODUCT_TYPE.SELL, 'DELIVERED');
      let quantityGive: number = await this.billService.countProductDelivered(product._id, PRODUCT_TYPE.GIVE, 'DELIVERED');
      let revenue: number = quantitySold * product.price;
      let isPurchased: boolean = await this.billService.checkProductPurchased(product._id);

      return {
        ...product.toObject(),
        categoryName: category.name,
        storeName: store.name,
        quantitySold,
        quantityGive,
        revenue,
        isPurchased,
      }
    }));

    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data: {total: products.total, products: fullInfoProducts} },
    })

  }


  @Public()
  @Get('product')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAllBySearchPublic(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<SuccessResponse> {
    const products = await this.productService.getAllBySearch(null, page, limit, search, null, null, {status: true})
    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data: products },
    })
  }

  @Public()
  @Get('products-other-in-store')
  @ApiQuery({ name: 'storeId', type: String, required: true })
  @ApiQuery({ name: 'productId', type: String, required: true })
  async getAllOtherProductByStoreId(
    @Query('storeId') storeId: string,
    @Query('productId') productId: string,
  ): Promise<SuccessResponse> {

    const products = await this.productService.getProductsByStoreId(storeId)

    const relateProducts = products.filter(product => product._id.toString() !== productId).slice(0, 12)

    return new SuccessResponse({
      message: "Lấy danh sách tất cả sản phẩm khác cùng cửa hàng thành công!",
      metadata: { total: relateProducts.length, data: relateProducts },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Patch('product/seller/:id')
  async update(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ): Promise<SuccessResponse | NotFoundException> {
    const newProduct = await this.productService.update(id, product)
    if (!newProduct) return new NotFoundException("Không tìm thấy sản phẩm này!")
    return new SuccessResponse({
      message: "Cập nhật sản phẩm thành công!",
      metadata: { data: newProduct },
    })
  }


  @Public()
  @Get('product/listProductLasted')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getlistProductLasted(
    @Query('limit') limit: number,
  ): Promise<SuccessResponse> {
    const products = await this.productService.getListProductLasted(limit)
    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data: products },
    })
  }

  @Public()
  @Get('product/mostProductsInStore')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async mostProductsInStore(
    @Query('limit') limit: number,
  ): Promise<SuccessResponse> {

    const products = await this.productService.mostProductsInStore(limit)

    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data: products },
    })
  }

  @Public()
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Post('product/random')
  async getRandom(
    @Body() excludeIds: ExcludeIds,
    @Query('limit') limit: number,
    @Query() cursor?: FilterDate,
  ): Promise<SuccessResponse | NotFoundException> {

    const products: Product[] = await this.productService.getRandomProducts(limit, excludeIds, cursor)

    if (!products) return new NotFoundException("Không tìm thấy sản phẩm!")

     const nextCursor = products.length > 0 ? products[products.length - 1]['createdAt'] : null;

    return new SuccessResponse({
      message: "Lấy thông tin sản phẩm thành công!",
      metadata: { nextCursor, data: products },
    })
  }


  @Public()
  @Get('product-filter')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAllBySearchAndFilterPublic(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query() filter?: FilterProduct,
  ): Promise<SuccessResponse> {

    const category = await this.categoryService.getById(search.toString())

    const products = await this.productService.getAllBySearchAndFilter(page, limit, search, filter)

    const data = {
      total: products.total,
      products: products.products,
      categoryName: category.name,
    }

    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data },
    })
  }


  @Public()
  @Get('product/:id')
  async getById(
    @Param('id') id: string
  ): Promise<SuccessResponse | NotFoundException> {


    const product = await this.productService.getById(id)
    if (!product) return new NotFoundException("Không tìm thấy sản phẩm này!")

    const type = product.price === 0 ? PRODUCT_TYPE.GIVE : PRODUCT_TYPE.SELL;

    let quantityDelivered: number = await this.billService.countProductDelivered(id, type, 'DELIVERED');

    return new SuccessResponse({
      message: "Lấy thông tin sản phẩm thành công!",
      metadata: { data: product, quantityDelivered},
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteProductAbility())
  @CheckRole(RoleName.MANAGER, RoleName.SELLER)
  @Delete('product/:id')
  async deleteProduct(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.deleteProduct(id);
    if (!product) return new NotFoundException("Không tìm thấy sản phẩm này!")
    return new SuccessResponse({
      message: "Xóa sản phẩm thành công!",
      metadata: { data: product },
    })
  }


}
