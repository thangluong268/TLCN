import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { Bill } from './schema/bill.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateBillAbility, CreateRoleAbility, ReadBillAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import { Types } from 'mongoose';

@Controller('user/bill')
@ApiTags('Bill')
@ApiBearerAuth('Authorization')
export class BillController {
  constructor(private readonly billService: BillService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateBillAbility())
  @Post()
  async createBill(
    @Body() bill: CreateBillDto,
    @Req() req: Request
  ): Promise<Bill> {
    const userId = req.user['userId']
    const newBill = await this.billService.createBill(userId, bill)
    return newBill
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'status', type: String, required: false })
  async getAllByStatus(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: string
  ): Promise<{ total: number, bills: Bill[] }> {
    const userId = new Types.ObjectId(req.user['userId'])
    const data = await this.billService.getAllByStatus(userId, page, limit, status)
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
    const result = await this.billService.cancelBill(id)
    return result
  }
}
