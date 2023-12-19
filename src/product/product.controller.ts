import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CheckAbilities,
  CreateProductAbility,
  DeleteProductAbility,
  ReadProductAbility,
  UpdateProductAbility,
} from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { BillService } from '../bill/bill.service';
import { PRODUCT_TYPE } from '../bill/schema/bill.schema';
import { CategoryService } from '../category/category.service';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { EvaluationService } from '../evaluation/evaluation.service';
import { FeedbackService } from '../feedback/feedback.service';
import { Feedback } from '../feedback/schema/feedback.schema';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/schema/notification.schema';
import { RoleName } from '../role/schema/role.schema';
import { StoreService } from '../store/store.service';
import { UserService } from '../user/user.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ExcludeIds, FilterDate, FilterProduct, ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';

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
    private readonly feedbackService: FeedbackService,
  ) {}

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Post('product/seller')
  async create(@Body() product: CreateProductDto, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getByUserId(userId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    const category = await this.categoryService.getById(product.categoryId);
    if (!category) return new NotFoundException('Không tìm thấy danh mục này!');

    const newProduct = await this.productService.create(store._id, product);

    await this.evaluationService.create(newProduct._id);

    const userHasFollowStores = await this.userService.getFollowStoresByStoreId(store._id);

    const notificationPromises: Promise<Notification>[] = [];

    for (const user of userHasFollowStores) {
      if (userId === user._id) continue;

      const notificationPromise = this.notificationService.create({
        userIdFrom: userId,
        userIdTo: user._id,
        content: `đã đăng sản phẩm mới. ${newProduct.productName}`,
        type: 'Thêm sản phẩm',
        sub: {
          fullName: store.name,
          avatar: store.avatar,
          productId: newProduct._id.toString(),
        },
      });

      notificationPromises.push(notificationPromise);
    }
    await Promise.all(notificationPromises);

    return new SuccessResponse({
      message: 'Tạo sản phẩm thành công!',
      metadata: { data: newProduct },
    });
  }

  // để tạo nhiều data một lúc (để test)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Post('product/sellerCreateMultiple')
  async sellerCreateMultiple(@Body() products: CreateProductDto[], @GetCurrentUserId() userId: string): Promise<void | NotFoundException> {
    const store = await this.storeService.getByUserId(userId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');
    products.forEach(async product => {
      const newProduct = await this.productService.create(store._id, product);
      await this.evaluationService.create(newProduct._id);
    });
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
    const store = await this.storeService.getByUserId(userId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    const products = await this.productService.getAllBySearch(store._id, page, limit, search, sortType, sortValue, {});

    const fullInfoProducts: ProductDto[] = await Promise.all(
      products.products.map(async (product: Product) => {
        const category = await this.categoryService.getById(product.categoryId);
        const quantitySold: number = await this.billService.countProductDelivered(product._id, PRODUCT_TYPE.SELL, 'DELIVERED');
        const quantityGive: number = await this.billService.countProductDelivered(product._id, PRODUCT_TYPE.GIVE, 'DELIVERED');
        const revenue: number = quantitySold * product.price;
        const isPurchased: boolean = await this.billService.checkProductPurchased(product._id);

        return {
          ...product.toObject(),
          categoryName: category.name,
          storeName: store.name,
          quantitySold,
          quantityGive,
          revenue,
          isPurchased,
        };
      }),
    );

    return new SuccessResponse({
      message: 'Lấy danh sách sản phẩm thành công!',
      metadata: { data: { total: products.total, products: fullInfoProducts } },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadProductAbility())
  @CheckRole(RoleName.ADMIN, RoleName.MANAGER_PRODUCT)
  @Get('product/admin')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAllBySearchPublic(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string): Promise<SuccessResponse> {
    const data = await this.productService.getAllBySearch(null, page, limit, search, null, null, {});

    const fullInfoProducts = await Promise.all(
      data.products.map(async (product: Product) => {
        const category = await this.categoryService.getById(product.categoryId);
        const store = await this.storeService.getById(product.storeId);
        const quantitySold: number = await this.billService.countProductDelivered(product._id, PRODUCT_TYPE.SELL, 'DELIVERED');
        const quantityGive: number = await this.billService.countProductDelivered(product._id, PRODUCT_TYPE.GIVE, 'DELIVERED');
        const revenue: number = quantitySold * product.price;

        return {
          ...product.toObject(),
          categoryName: category.name,
          storeName: store.name,
          quantitySold,
          quantityGive,
          revenue,
        };
      }),
    );

    return new SuccessResponse({
      message: 'Lấy danh sách sản phẩm thành công!',
      metadata: { total: data.total, data: fullInfoProducts },
    });
  }

  @Public()
  @Get('products-other-in-store')
  @ApiQuery({ name: 'storeId', type: String, required: true })
  @ApiQuery({ name: 'productId', type: String, required: true })
  async getAllOtherProductByStoreId(@Query('storeId') storeId: string, @Query('productId') productId: string): Promise<SuccessResponse> {
    const products = await this.productService.getProductsByStoreId(storeId);

    const relateProducts = products.filter(product => product._id.toString() !== productId).slice(0, 12);

    return new SuccessResponse({
      message: 'Lấy danh sách tất cả sản phẩm khác cùng cửa hàng thành công!',
      metadata: { total: relateProducts.length, data: relateProducts },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateProductAbility())
  @CheckRole(RoleName.SELLER, RoleName.ADMIN)
  @Patch('product/seller/:id')
  async updateSeller(@Param('id') id: string, @Body() product: UpdateProductDto): Promise<SuccessResponse | NotFoundException> {
    const newProduct = await this.productService.update(id, product);
    if (!newProduct) return new NotFoundException('Không tìm thấy sản phẩm này!');
    return new SuccessResponse({
      message: 'Cập nhật sản phẩm thành công!',
      metadata: { data: newProduct },
    });
  }

  @Public()
  @Get('product/listProductLasted')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getlistProductLasted(@Query('limit') limit: number): Promise<SuccessResponse> {
    const data = await this.productService.getListProductLasted(limit);
    return new SuccessResponse({
      message: 'Lấy danh sách sản phẩm thành công!',
      metadata: { data },
    });
  }

  @Public()
  @Get('product/mostProductsInStore')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async mostProductsInStore(@Query('limit') limit: number): Promise<SuccessResponse> {
    const storeHaveMostProducts = await this.productService.getListStoreHaveMostProducts(limit);

    const data = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storeHaveMostProducts.map(async (item: any) => {
        const store = await this.storeService.getById(item._id);
        if (!store) throw new NotFoundException('Không tìm thấy cửa hàng này!');

        let products: Product[] = await this.productService.getProductsByStoreId(item._id.toString());

        products = products.map(product => {
          product = product.toObject();
          delete product.storeId;
          delete product.status;
          delete product['createdAt'];
          delete product['updatedAt'];
          delete product.__v;
          return product;
        });

        return {
          storeId: store._id,
          storeName: store.name,
          storeAvatar: store.avatar,
          listProducts: products.slice(0, 10),
        };
      }),
    );

    return new SuccessResponse({
      message: 'Lấy danh sách sản phẩm thành công!',
      metadata: { data },
    });
  }

  @Public()
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Post('product/random')
  async getRandom(
    @Body() excludeIds: ExcludeIds,
    @Query('limit') limit: number,
    @Query() cursor?: FilterDate,
  ): Promise<SuccessResponse | NotFoundException> {
    const products: Product[] = await this.productService.getRandomProducts(limit, excludeIds, cursor);

    if (!products) return new NotFoundException('Không tìm thấy sản phẩm!');

    const nextCursor = products.length > 0 ? products[products.length - 1]['createdAt'] : null;

    return new SuccessResponse({
      message: 'Lấy thông tin sản phẩm thành công!',
      metadata: { nextCursor, data: products },
    });
  }

  @Public()
  @Get('product-filter')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: true })
  async getAllBySearchAndFilterPublic(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query() filter?: FilterProduct,
  ): Promise<SuccessResponse> {
    const category = await this.categoryService.getById(search.toString());

    const products = await this.productService.getAllBySearchAndFilter(page, limit, search, filter);

    const data = {
      total: products.total,
      products: products.products,
      categoryName: category.name,
    };

    return new SuccessResponse({
      message: 'Lấy danh sách sản phẩm thành công!',
      metadata: { data },
    });
  }

  @Public()
  @Get('product/:id')
  async getById(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.getById(id);
    if (!product) return new NotFoundException('Không tìm thấy sản phẩm này!');

    const type = product.price === 0 ? PRODUCT_TYPE.GIVE : PRODUCT_TYPE.SELL;

    const quantityDelivered: number = await this.billService.countProductDelivered(id, type, 'DELIVERED');

    return new SuccessResponse({
      message: 'Lấy thông tin sản phẩm thành công!',
      metadata: { data: product, quantityDelivered },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadProductAbility())
  @CheckRole(RoleName.ADMIN, RoleName.MANAGER_PRODUCT)
  @Get('product/admin/:id')
  async getByIdAdmin(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.getById(id);
    if (!product) return new NotFoundException('Không tìm thấy sản phẩm này!');

    const type = product.price === 0 ? PRODUCT_TYPE.GIVE : PRODUCT_TYPE.SELL;

    const quantityDelivered: number = await this.billService.countProductDelivered(id, type, 'DELIVERED');

    const evaluation = await this.evaluationService.getByProductId(id);
    if (!evaluation) return new NotFoundException('Không tìm thấy đánh giá của sản phẩm này!');

    const total: number = evaluation.emojis.length;

    const emoji = {
      Haha: 0,
      Love: 0,
      Wow: 0,
      Sad: 0,
      Angry: 0,
      like: 0,
    };

    evaluation.emojis.forEach(e => {
      switch (e.name) {
        case 'Haha':
          emoji.Haha++;
          break;
        case 'Love':
          emoji.Love++;
          break;
        case 'Wow':
          emoji.Wow++;
          break;
        case 'Sad':
          emoji.Sad++;
          break;
        case 'Angry':
          emoji.Angry++;
          break;
        case 'like':
          emoji.like++;
          break;
      }
    });

    const emojis = {
      total,
      haha: emoji.Haha,
      love: emoji.Love,
      wow: emoji.Wow,
      sad: emoji.Sad,
      angry: emoji.Angry,
      like: emoji.like,
    };

    const feedbacks: Feedback[] = await this.feedbackService.getAllByProductId(id);

    const star = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    const startPercent = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let averageStar = 0;

    feedbacks.forEach(feedback => {
      star[feedback.star]++;
    });

    Object.keys(star).forEach(key => {
      startPercent[key] = Math.round((star[key] / feedbacks.length) * 100);
    });

    Object.keys(star).forEach(key => {
      averageStar += star[key] * Number(key);
    });

    averageStar = Number((averageStar / feedbacks.length).toFixed(2));

    const totalFeedback = await this.feedbackService.countTotal(id);

    return new SuccessResponse({
      message: 'Lấy thông tin sản phẩm bởi Admin thành công!',
      metadata: { data: product, quantityDelivered, emojis, startPercent, averageStar, totalFeedback },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteProductAbility())
  @CheckRole(RoleName.MANAGER_PRODUCT, RoleName.SELLER)
  @Delete('product/:id')
  async deleteProduct(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.deleteProduct(id);
    if (!product) return new NotFoundException('Không tìm thấy sản phẩm này!');
    return new SuccessResponse({
      message: 'Xóa sản phẩm thành công!',
      metadata: { data: product },
    });
  }

  @Public()
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  @Delete('product')
  async deleteCategory(@Query('categoryId') categoryId: string): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.deleteProductByCategory(categoryId);

    return new SuccessResponse({
      message: 'Xóa sản phẩm thành công!',
      metadata: { data: product },
    });
  }
}
