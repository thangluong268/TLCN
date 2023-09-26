import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { Store } from 'src/store/schema/store.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>
    ) { }

    async create(store: Store, product: CreateProductDto): Promise<Product> {
        try {
            const newProduct = await this.productModel.create(product)
            newProduct.storeId = store._id
            newProduct.storeName = store.storeName
            await newProduct.save()
            return newProduct
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getById(id: string): Promise<Product> {
        try {
            const product = await this.productModel.findById(id)
            if (!product) { throw new NotFoundExceptionCustom(Product.name) }
            return product
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllBySearch(storeIdInput: string, pageQuery: number, limitQuery: number, searchQuery: string)
        : Promise<{ total: number, products: Product[] }> {
        const storeId = storeIdInput ? {storeId: storeIdInput} : {}
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT)
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT)
        const search = searchQuery
            ? {
                $or: [
                    { productName: { $regex: searchQuery, $options: "i" } },
                    { category: { $regex: searchQuery, $options: "i" } },
                    { keywords: { $regex: searchQuery, $options: "i" } }
                ]
            }
            : {}
        const skip = limit * (page - 1)
        try {
            const total = await this.productModel.countDocuments({ ...search, ...storeId })
            const products = await this.productModel.find({ ...search, ...storeId }).limit(limit).skip(skip)
            return { total, products }
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(id: string, product: any): Promise<Product> {
        try {
            product = {status: false}
            await this.getById(id)
            const updatedProduct = await this.productModel.findByIdAndUpdate({ _id: id }, product, { new: true })
            return updatedProduct
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }

    async deleteProduct(productId: string): Promise<Product> {
        try {
            const product = await this.productModel.findOneAndDelete({ _id: productId })
            return product
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
