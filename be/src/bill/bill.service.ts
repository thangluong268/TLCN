import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schema/bill.schema';
import mongoose, { Model, ObjectId, Types, Error as MongooseError } from 'mongoose';
import { CreateBillDto } from './dto/create-bill.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { ProductBillDto } from './dto/product-bill.dto';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';

@Injectable()
export class BillService {
    constructor(
        @InjectModel(Bill.name)
        private readonly billModel: Model<Bill>
    ) { }

    getTotalPrice(listProducts: ProductBillDto[], promotionValue: number): number {
        const productPrice = listProducts.reduce((total: number, product: ProductBillDto) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0)
        const totalPrice = productPrice - promotionValue
        return totalPrice
    }

    async createBill(userId: string, bill: CreateBillDto): Promise<Bill> {
        try {
            const newBill = await this.billModel.create(bill)
            newBill.userId = new Types.ObjectId(userId)
            newBill.totalPrice = this.getTotalPrice(bill.listProducts, bill.promotionValue)
            await newBill.save()
            return newBill
        }
        catch(err){
            if(err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllByStatus(userId: Types.ObjectId, pageQuery: number, limitQuery: number, statusQuery: string)
    : Promise<{ total: number, bills: Bill[] }> {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT)
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT)
        const status = new RegExp(statusQuery, 'i') || "Đã đặt"
        const skip = limit * (page - 1)
        try{
            const total = await this.billModel.countDocuments({ status, userId })
            const bills = await this.billModel.find({ status, userId }).limit(limit).skip(skip)
            return { total, bills }
        }
        catch(err){
            if(err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getDetailById(id: string): Promise<Bill> {
        try{
            const bill = await this.billModel.findById(id)
            if(!bill) { throw new NotFoundExceptionCustom(Bill.name) }
            return bill
        }
        catch(err){
            if(err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async cancelBill(id: string): Promise<boolean> {
        try{
            const bill = await this.billModel.findById(id)
            if(!bill) { throw new NotFoundExceptionCustom(Bill.name) }
            bill.status = "Đã hủy"
            await bill.save()
            return true
        }
        catch(err){
            if(err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
