import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Store } from '../store/schema/store.schema';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import removeVietnameseTones from '../utils/removeVietNameseTones';
import sortByConditions from '../utils/sortByContitions';
import { ExcludeIds, FilterDate, FilterProduct } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>
    ) { }

    async create(storeId: string, product: CreateProductDto): Promise<Product> {
        try {
            const newProduct = await this.productModel.create(product)
            newProduct.storeId = storeId
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
            const product = await this.productModel.findOne({ _id: id })
            return product
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllBySearch(storeIdInput: string, pageQuery: number, limitQuery: number, searchQuery: string,
        sortTypeQuery: string = 'desc', sortValueQuery: string = 'productName', status: any)
        : Promise<{ total: number, products: Product[] }> {
        const storeId = storeIdInput ? { storeId: storeIdInput } : {}
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT)
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT)
        const search = searchQuery
            ? {
                $or: [
                    { productName: { $regex: searchQuery, $options: "i" } },
                    { description: { $regex: searchQuery, $options: "i" } },
                    { keywords: { $regex: searchQuery, $options: "i" } },
                    { type: { $regex: searchQuery, $options: "i" } },
                    { storeName: { $regex: searchQuery, $options: "i" } },
                    { categoryId: { $regex: searchQuery, $options: "i" } },
                ]
            }
            : {}
        const skip = limit * (page - 1)
        try {
            const total = await this.productModel.countDocuments({ ...search, ...storeId, ...status })
            const products = await this.productModel.find({ ...search, ...storeId, ...status })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip)

            sortByConditions(products, sortTypeQuery, sortValueQuery)

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
            const updatedProduct = await this.productModel.findByIdAndUpdate({ _id: id }, { ...product }, { new: true })
            if (product.quantity === 0) {
                updatedProduct.status = false
                await updatedProduct.save()
            }
            return updatedProduct
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async deleteProduct(productId: string): Promise<Product> {
        try {
            const product = await this.productModel.findByIdAndDelete(productId)
            return product
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getListProductLasted(limit: number): Promise<Product[]> {
        try {
            const products = await this.productModel.find({ status: true }).sort({ createdAt: -1 }).limit(limit)
            return products
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async mostProductsInStore(limit: number): Promise<Product[]> {
        try {
            const limitQuery = Number(limit) || Number(process.env.LIMIT_DEFAULT)
            const products = await this.productModel.aggregate([
                {
                    $match: { status: true }
                },
                {
                    $group: {
                        _id: '$storeId',
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: limitQuery
                }
            ])
            const storeIds = products.map(product => product._id)
            var arr = []
            for (let i = 0; i < storeIds.length; i++) {
                const product = await this.productModel.find({ storeId: storeIds[i] }).limit(10)
                arr.push(product)
            }
            return arr
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async updateQuantity(id: string, quantitySold: number): Promise<void> {
        try {
            const product: Product = await this.getById(id)
            product.quantity -= quantitySold
            if (product.quantity === 0) {
                product.status = false
            }
            await product.save()
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


    async getRandomProducts(limit: number = 5, excludeIdsBody: ExcludeIds, cursor?: FilterDate): Promise<Product[]> {
        try {

            const excludeIds: Types.ObjectId[] = excludeIdsBody.ids.map(id => new Types.ObjectId(id))

            let query: any = {};

            if (cursor.date)
                query = { createdAt: { $gt: new Date(cursor.date) } }

            const products: Product[] = await this.productModel.aggregate([
                {
                    $match: {
                        ...query,
                        _id: { $nin: excludeIds },
                        status: true
                    }
                },
                { $sample: { size: Number(limit) } }
            ])

            let remainingLimit: number = limit - products.length

            if (remainingLimit < limit) {

                let currentExcludeIds: Types.ObjectId[] = products.map(product => product._id)
                excludeIds.push(...currentExcludeIds)

                let otherProducts: Product[] = await this.productModel.aggregate([
                    {
                        $match: {
                            _id: { $nin: excludeIds },
                            status: true
                        }
                    },
                    { $sample: { size: remainingLimit } }
                ])
                products.push(...otherProducts)
            }

            return products

        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllBySearchAndFilter(pageQuery: number = 1, limitQuery: number = 5, searchQuery: string, filterQuery?: FilterProduct)
        : Promise<{ total: number, products: Product[] }> {

        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const skip = limit * (page - 1);

        try {
            let query: any = {};

            if (searchQuery) {
                query.$or = [
                    { productName: { $regex: searchQuery, $options: "i" } },
                    { description: { $regex: searchQuery, $options: "i" } },
                    { keywords: { $regex: searchQuery, $options: "i" } },
                    { type: { $regex: searchQuery, $options: "i" } },
                    { storeName: { $regex: searchQuery, $options: "i" } },
                    { categoryId: { $regex: searchQuery, $options: "i" } },
                ];
            }

            if (filterQuery) {
                query = { ...query, ...this.buildFilterQuery(filterQuery) };
            }

            let total = await this.productModel.countDocuments(query);
            let products = await this.productModel.find(query)
                .sort({ price: 1, quantity: 1, createdAt: -1 })
                .limit(limit)
                .skip(skip);

            return { total, products };

        } catch (err) {
            if (err instanceof MongooseError) {
                throw new InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }

    private buildFilterQuery(filterQuery: FilterProduct): any {
        let filter = {};

        if (filterQuery.priceMin && filterQuery.priceMax) {
            filter['price'] = { $gte: Number(filterQuery.priceMin), $lte: Number(filterQuery.priceMax) };
        }

        if (filterQuery.quantityMin && filterQuery.quantityMax) {
            filter['quantity'] = { $gte: Number(filterQuery.quantityMin), $lte: Number(filterQuery.quantityMax) };
        }

        if (filterQuery.createdAtMin && filterQuery.createdAtMax) {
            filter['createdAt'] = { $gte: new Date(filterQuery.createdAtMin), $lte: new Date(filterQuery.createdAtMax) };
        }

        return filter;
    }

    async getProductsByStoreId(storeId: string): Promise<Product[]> {
        try {
            const products = await this.productModel.find({ storeId })
            return products
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
