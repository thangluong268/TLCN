import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schema/bill.schema';
import mongoose, { Model, ObjectId, Types, Error as MongooseError } from 'mongoose';
import { CreateBillDto } from './dto/create-bill.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { ProductBillDto } from './dto/product-bill.dto';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { User } from 'src/user/schema/user.schema';
import { Store } from 'src/store/schema/store.schema';
import { Product } from 'src/product/schema/product.schema';

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

    async create(user: User, products: Product[], bill: CreateBillDto): Promise<Bill> {
        try {
            const newBill = await this.billModel.create(bill)
            newBill.userId = user._id
            newBill.fullName = user.fullName
            newBill.email = user.email
            newBill.phone = user.phone
            newBill.address = bill.address
            newBill.storeId = products[0].storeId
            newBill.storeName = products[0].storeName
            newBill.listProducts = products.map(product => {
                const productBill = new ProductBillDto()
                productBill.avatar = product.avatar
                productBill.productId = product._id
                productBill.productName = product.productName
                productBill.quantity = product.quantity
                productBill.price = product.price
                return productBill
            })
            newBill.totalPrice = this.getTotalPrice(newBill.listProducts, bill.promotionValue)
            await newBill.save()
            return newBill
        }
        catch(err){
            if(err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllByStatus(idCondition: any, pageQuery: number, limitQuery: number, searchQuery: string, statusQuery: string)
    : Promise<{ total: number, bills: Bill[] }> {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT)
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT)
        const search = searchQuery
            ? {
                $or: [
                    { storeName: { $regex: searchQuery, $options: "i" } },
                    { listProducts: { $elemMatch: { productName: { $regex: searchQuery, $options: "i" } } } }
                ]
            }
            : {}
        const statusRegex = { status: { $regex: statusQuery, $options: "i" } }
        const skip = limit * (page - 1)
        try{
            const total = await this.billModel.countDocuments({ ...idCondition, ...statusRegex, ...search })
            const bills = await this.billModel.find({ ...idCondition, ...statusRegex, ...search }).limit(limit).skip(skip)
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

    async update(id: string, status: string): Promise<boolean> {
        try{
            const bill = await this.billModel.findByIdAndUpdate({ _id: id }, { status })
            if(!bill) { throw new NotFoundExceptionCustom(Bill.name) }
            return true
        }
        catch(err){
            if(err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
