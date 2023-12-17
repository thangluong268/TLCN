/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, CreateBillAbility, ReadBillAbility, UpdateBillAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-userid.decorator';
import { CartService } from '../cart/cart.service';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { ProductService } from '../product/product.service';
import { RoleName } from '../role/schema/role.schema';
import { StoreService } from '../store/store.service';
import { UserService } from '../user/user.service';
import { BillService } from './bill.service';
import { BillDto } from './dto/bill.dto';
import { CreateBillDto, ProductInfo } from './dto/create-bill.dto';
import { GiveGateway, MoMoGateway, PAYMENT_METHOD, VNPayGateway } from './payment/payment.gateway';
import { PaymentService } from './payment/payment.service';
import { BILL_STATUS, BILL_STATUS_TRANSITION } from './schema/bill.schema';

@Controller('bill')
@ApiTags('Bill')
@ApiBearerAuth('Authorization')
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly cartService: CartService,
  ) {
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.VNPAY, new VNPayGateway());
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.MOMO, new MoMoGateway());
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.GIVE, new GiveGateway());
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateBillAbility())
  @CheckRole(RoleName.USER)
  @Post('user')
  async create(@Body() createBillDto: CreateBillDto, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const newBills = await Promise.all(
      createBillDto.data.map(async billDto => {
        await this.userService.updateWallet(userId, billDto.totalPrice, 'plus');

        await this.cartService.removeMultiProductInCart(userId, billDto.listProducts, billDto.storeId);

        billDto.listProducts.forEach(async (product: ProductInfo) => {
          await this.productService.updateQuantity(product.productId, product.quantity);
        });

        const newBill = await this.billService.create(
          userId,
          billDto,
          createBillDto.deliveryMethod,
          createBillDto.paymentMethod,
          createBillDto.receiverInfo,
          createBillDto.giveInfo,
          createBillDto.deliveryFee,
        );

        return newBill;
      }),
    );

    return new SuccessResponse({
      message: 'Đặt hàng thành công!',
      metadata: { data: newBills },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.SELLER)
  @ApiQuery({ name: 'year', type: Number, required: false, example: '2023' })
  @Get('seller/count-total-by-status')
  async countTotalByStatusSeller(@Query('year') year: number, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const store = await this.storeService.getByUserId(userId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    const statusData: string[] = BILL_STATUS.split('-').map((item: string) => item.toUpperCase());

    const countTotal = await Promise.all(
      statusData.map(async (status: string) => {
        return this.billService.countTotalByStatusSeller(store._id, status, year);
      }),
    );

    const transformedData = Object.fromEntries(countTotal.map((value, index) => [statusData[index], value]));

    return new SuccessResponse({
      message: 'Lấy tổng số lượng các đơn theo trạng thái thành công!',
      metadata: { data: transformedData },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.USER)
  @Get('user/count-total-by-status')
  async countTotalByStatusUser(@GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const statusData: string[] = BILL_STATUS.split('-').map((item: string) => item.toUpperCase());

    const countTotal = await Promise.all(
      statusData.map(async (status: string) => {
        return this.billService.countTotalByStatusUser(userId, status);
      }),
    );
    const transformedData: any = countTotal.map((value, index) => {
      return {
        status: statusData[index],
        title: BILL_STATUS_TRANSITION[statusData[index]],
        value: value,
      };
    });

    return new SuccessResponse({
      message: 'Lấy tổng số lượng các đơn theo trạng thái thành công!',
      metadata: { data: transformedData },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.SELLER)
  @ApiQuery({ name: 'year', type: Number, required: true, example: '2023' })
  @Get('seller/calculate-revenue-by-year')
  async calculateRevenueByYear(@Query('year') year: number, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const store = await this.storeService.getByUserId(userId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    const data = await this.billService.calculateRevenueByYear(store._id, year);

    return new SuccessResponse({
      message: 'Lấy doanh thu của từng tháng theo năm thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.SELLER)
  @ApiQuery({ name: 'year', type: Number, required: true, example: '2023' })
  @Get('seller/count-charity-by-year')
  async countCharityByYear(@Query('year') year: number, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const store = await this.storeService.getByUserId(userId);
    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    const data = await this.billService.countCharityByYear(store._id, year);

    return new SuccessResponse({
      message: 'Lấy kết quả từ thiện của từng tháng theo năm thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.ADMIN)
  @ApiQuery({ name: 'year', type: Number, required: true, example: '2023' })
  @Get('admin/calculate-total-revenue-by-year')
  async calculateTotalRevenueByYear(@Query('year') year: number, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(userId);
    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const data = await this.billService.calculateTotalRevenueByYear(year);

    return new SuccessResponse({
      message: 'Lấy tổng doanh thu của từng tháng theo năm thành công!',
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.USER)
  @Get('user')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'status', type: String, required: true, example: 'NEW' })
  async getAllByStatusUser(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(userId);

    if (!user) return new NotFoundException('Không tìm thấy người dùng này!');

    const data: any = await this.billService.getAllByStatus({ userId }, page, limit, status);

    const fullData: BillDto[] = await Promise.all(
      data.bills.map(async (bill: any) => {
        const listProductsFullInfo = await Promise.all(
          bill.listProducts.map(async (product: any) => {
            const productFullInfo = await this.productService.getById(product.productId);

            const productData = {
              product: productFullInfo,
              subInfo: product,
            };

            delete productData.subInfo.productId;
            delete productData.subInfo.type;

            return productData;
          }),
        );

        const storeInfo = await this.storeService.getById(bill.storeId);

        let userInfo = await this.userService.getById(bill.userId);

        userInfo = userInfo.toObject();

        delete userInfo.password;

        return {
          _id: bill._id,
          storeInfo,
          listProductsFullInfo,
          userInfo,
          notes: bill.notes,
          totalPrice: bill.totalPrice,
          deliveryMethod: bill.deliveryMethod,
          paymentMethod: bill.paymentMethod,
          receiverInfo: bill.receiverInfo,
          giveInfo: bill.giveInfo,
          deliveryFee: bill.deliveryFee,
          status: bill.status,
          isPaid: bill.isPaid,
          createdAt: bill.createdAt,
        };
      }),
    );

    return new SuccessResponse({
      message: `Lấy danh sách đơn hàng ${RoleName.USER} thành công!`,
      metadata: { data: { total: data.total, fullData } },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.SELLER)
  @Get('seller')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'status', type: String, required: true, example: 'NEW' })
  async getAllByStatusSeller(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getByUserId(userId);

    if (!store) return new NotFoundException('Không tìm thấy cửa hàng này!');

    const data: any = await this.billService.getAllByStatus({ storeId: store._id }, page, limit, status);

    const fullData: BillDto[] = await Promise.all(
      data.bills.map(async (bill: any) => {
        const listProductsFullInfo = await Promise.all(
          bill.listProducts.map(async (product: any) => {
            const productFullInfo = await this.productService.getById(product.productId);

            const productData = {
              product: productFullInfo,
              subInfo: product,
            };

            delete productData.subInfo.productId;
            delete productData.subInfo.type;

            return productData;
          }),
        );

        const storeInfo = await this.storeService.getById(bill.storeId);

        let userInfo = await this.userService.getById(bill.userId);

        userInfo = userInfo.toObject();

        delete userInfo.password;

        return {
          _id: bill._id,
          storeInfo,
          listProductsFullInfo,
          userInfo,
          notes: bill.notes,
          totalPrice: bill.totalPrice,
          deliveryMethod: bill.deliveryMethod,
          paymentMethod: bill.paymentMethod,
          receiverInfo: bill.receiverInfo,
          giveInfo: bill.giveInfo,
          deliveryFee: bill.deliveryFee,
          status: bill.status,
          isPaid: bill.isPaid,
          createdAt: bill.createdAt,
        };
      }),
    );

    return new SuccessResponse({
      message: `Lấy danh sách đơn hàng ${RoleName.SELLER} thành công!`,
      metadata: { data: { total: data.total, fullData } },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.ADMIN)
  @Get('admin/count-total-data')
  async countTotalData(): Promise<SuccessResponse | NotFoundException> {
    const totalProduct: number = await this.productService.countTotal();
    const totalStore: number = await this.storeService.countTotal();
    const totalUser: number = await this.userService.countTotal();
    const totalRevenue: number = await this.billService.calculateRevenueAllTime();

    const data = {
      totalProduct,
      totalStore,
      totalUser,
      totalRevenue,
    };

    return new SuccessResponse({
      message: `Lấy data thành công!`,
      metadata: { data },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.USER)
  @Get('user/:id')
  async getMyBill(@Param('id') id: string, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const bill: any = await this.billService.getMyBill(id, userId);

    if (!bill) return new NotFoundException('Không tìm thấy đơn hàng này!');

    const listProductsFullInfo = await Promise.all(
      bill.listProducts.map(async (product: any) => {
        const productFullInfo = await this.productService.getById(product.productId);

        const productData = {
          product: productFullInfo,
          subInfo: product,
        };

        delete productData.subInfo.productId;
        delete productData.subInfo.type;

        return productData;
      }),
    );

    const storeInfo = await this.storeService.getById(bill.storeId);

    let userInfo = await this.userService.getById(bill.userId);

    userInfo = userInfo.toObject();

    delete userInfo.password;

    const fullData: any = {
      _id: bill._id,
      storeInfo,
      listProductsFullInfo,
      userInfo,
      notes: bill.notes,
      totalPrice: bill.totalPrice,
      deliveryMethod: bill.deliveryMethod,
      paymentMethod: bill.paymentMethod,
      receiverInfo: bill.receiverInfo,
      giveInfo: bill.giveInfo,
      deliveryFee: bill.deliveryFee,
      status: bill.status,
      isPaid: bill.isPaid,
      createdAt: bill.createdAt,
    };

    return new SuccessResponse({
      message: `Lấy đơn hàng thành công!`,
      metadata: { data: fullData },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateBillAbility())
  @CheckRole(RoleName.USER)
  @Put('user/:id')
  async cancelBill(@Param('id') id: string, @GetCurrentUserId() userId: string): Promise<SuccessResponse | NotFoundException> {
    const bill = await this.billService.getById(id);

    const result = await this.billService.update(id, 'CANCELLED');

    if (!result) return new NotFoundException('Không tìm thấy đơn hàng này!');

    await this.userService.updateWallet(userId, bill.totalPrice, 'sub');

    return new SuccessResponse({
      message: 'Hủy đơn hàng thành công!',
      metadata: { data: result },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateBillAbility())
  @CheckRole(RoleName.SELLER)
  @Put('/seller/:id')
  @ApiQuery({ name: 'status', type: String, required: true })
  async updateStatus(@Param('id') id: string, @Query('status') status: string): Promise<SuccessResponse | NotFoundException> {
    const bill = await this.billService.getById(id);
    if (!bill) return new NotFoundException('Không tìm thấy đơn hàng này!');

    const result = await this.billService.update(id, status);
    if (!result) return new NotFoundException('Không tìm thấy đơn hàng này!');

    if (status === 'CANCELLED') await this.userService.updateWallet(bill.userId, bill.totalPrice, 'sub');

    if (status === 'RETURNED') {
      await this.userService.updateWallet(bill.userId, bill.totalPrice, 'sub');
      await this.userService.updateWallet(bill.userId, bill.totalPrice * 5, 'plus');
    }

    return new SuccessResponse({
      message: 'Cập nhật trạng thái đơn hàng thành công!',
      metadata: { data: result },
    });
  }
}
