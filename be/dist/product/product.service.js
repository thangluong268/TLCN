"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
const sortByContitions_1 = require("../utils/sortByContitions");
const product_schema_1 = require("./schema/product.schema");
let ProductService = class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(storeId, product) {
        try {
            const newProduct = await this.productModel.create(product);
            newProduct.storeId = storeId;
            await newProduct.save();
            return newProduct;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getById(id) {
        try {
            const product = await this.productModel.findOne({ _id: id });
            return product;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllBySearch(storeIdInput, pageQuery, limitQuery, searchQuery, sortTypeQuery = 'desc', sortValueQuery = 'productName', status) {
        const storeId = storeIdInput ? { storeId: storeIdInput } : {};
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const search = searchQuery
            ? {
                $or: [
                    { productName: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { keywords: { $regex: searchQuery, $options: 'i' } },
                    { type: { $regex: searchQuery, $options: 'i' } },
                    { storeName: { $regex: searchQuery, $options: 'i' } },
                    { categoryId: { $regex: searchQuery, $options: 'i' } },
                ],
            }
            : {};
        const skip = limit * (page - 1);
        try {
            const total = await this.productModel.countDocuments({ ...search, ...storeId, ...status });
            const products = await this.productModel
                .find({ ...search, ...storeId, ...status })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip);
            (0, sortByContitions_1.default)(products, sortTypeQuery, sortValueQuery);
            return { total, products };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, product) {
        try {
            const updatedProduct = await this.productModel.findByIdAndUpdate({ _id: id }, { ...product }, { new: true });
            if (product.quantity === 0) {
                updatedProduct.status = false;
                await updatedProduct.save();
            }
            return updatedProduct;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async deleteProduct(productId) {
        try {
            const product = await this.productModel.findByIdAndDelete(productId);
            return product;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getListProductLasted(limit) {
        try {
            const products = await this.productModel.find({ status: true }).sort({ createdAt: -1 }).limit(limit);
            return products;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateQuantity(id, quantitySold) {
        try {
            const product = await this.getById(id);
            product.quantity -= quantitySold;
            if (product.quantity === 0) {
                product.status = false;
            }
            await product.save();
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getRandomProducts(limit = 5, excludeIdsBody, cursor) {
        try {
            const excludeIds = excludeIdsBody.ids.map(id => new mongoose_2.Types.ObjectId(id));
            let query = {};
            if (cursor.date)
                query = { createdAt: { $gt: new Date(cursor.date) } };
            const products = await this.productModel.aggregate([
                {
                    $match: {
                        ...query,
                        _id: { $nin: excludeIds },
                        status: true,
                    },
                },
                { $sample: { size: Number(limit) } },
            ]);
            const remainingLimit = limit - products.length;
            if (remainingLimit < limit) {
                const currentExcludeIds = products.map(product => product._id);
                excludeIds.push(...currentExcludeIds);
                const otherProducts = await this.productModel.aggregate([
                    {
                        $match: {
                            _id: { $nin: excludeIds },
                            status: true,
                        },
                    },
                    { $sample: { size: remainingLimit } },
                ]);
                products.push(...otherProducts);
            }
            return products;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllBySearchAndFilter(pageQuery = 1, limitQuery = 5, searchQuery, filterQuery) {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const skip = limit * (page - 1);
        try {
            let query = {};
            if (searchQuery) {
                query.$or = [
                    { productName: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { keywords: { $regex: searchQuery, $options: 'i' } },
                    { type: { $regex: searchQuery, $options: 'i' } },
                    { storeName: { $regex: searchQuery, $options: 'i' } },
                    { categoryId: { $regex: searchQuery, $options: 'i' } },
                ];
            }
            if (filterQuery) {
                query = { ...query, ...this.buildFilterQuery(filterQuery) };
            }
            const total = await this.productModel.countDocuments(query);
            const products = await this.productModel.find(query).sort({ price: 1, quantity: 1, createdAt: -1 }).limit(limit).skip(skip);
            return { total, products };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError) {
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }
    buildFilterQuery(filterQuery) {
        const filter = {};
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
    async getProductsByStoreId(storeId) {
        try {
            const products = await this.productModel.find({ storeId });
            return products;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async deleteProductByCategory(categoryId) {
        try {
            await this.productModel.deleteMany({ categoryId });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getListStoreHaveMostProducts(limit = 5) {
        try {
            const products = await this.productModel.aggregate([
                {
                    $group: {
                        _id: '$storeId',
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { count: -1 },
                },
                {
                    $limit: limit,
                },
            ]);
            return products;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductService);
//# sourceMappingURL=product.service.js.map