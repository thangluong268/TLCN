import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { Bill } from './schema/bill.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateBillAbility, CreateRoleAbility, ReadBillAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import { Types } from 'mongoose';
import { PaymentService } from './payment/payment.service';
import { GiveGateway, MoMoGateway, PAYMENT_METHOD, VNPayGateway } from './payment/payment.gateway';
import { UserService } from 'src/user/user.service';
import { StoreService } from 'src/store/store.service';
import { ProductService } from 'src/product/product.service';

@Controller('bill/user')
@ApiTags('Bill')
@ApiBearerAuth('Authorization')
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
  ) {
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.VNPAY, new VNPayGateway())
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.MOMO, new MoMoGateway())
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.GIVE, new GiveGateway())
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateBillAbility())
  @Post()
  async create(
    @Body() bill: CreateBillDto,
    @Req() req: Request
  ): Promise<Bill> {
    const userId = req.user['userId']
    const user = await this.userService.getById(userId)
    const products = []
    bill.listProductId.map(async (productId) => {
      const product = await this.productService.getById(productId)
      products.push(product)
    })
    const newBill = await this.billService.create(user, products, bill)
    const result = await this.paymentService.processPayment(bill, bill.paymentMethod)
    console.log(result)
    return newBill
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'status', type: String, required: false })
  async getAllByStatus(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('status') status: string,
  ): Promise<{ total: number, bills: Bill[] }> {
    const userId = req.user['userId']
    console.log(userId)
    const data = await this.billService.getAllByStatus(userId, page, limit, search, status)
    return data
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @Get('/:id')
  async getDetailById(
    @Param('id') id: string
  ): Promise<Bill> {
    const bill = await this.billService.getDetailById(id)
    return bill
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @Put('/:id')
  async cancelBill(
    @Param('id') id: string
  ): Promise<boolean> {
    const result = await this.billService.cancel(id)
    return result
  }
}
