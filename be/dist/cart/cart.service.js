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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_bill_dto_1 = require("../bill/dto/product-bill.dto");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
const cart_create_dto_1 = require("./dto/cart-create.dto");
const cart_schema_1 = require("./schema/cart.schema");
let CartService = class CartService {
    constructor(cartModel) {
        this.cartModel = cartModel;
    }
    getTotalPrice(listProducts) {
        const totalPrice = listProducts.reduce((total, product) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0);
        return totalPrice;
    }
    async create(userId, store, product) {
        try {
            const cart = new cart_create_dto_1.CreateCartDto();
            cart.userId = userId;
            cart.storeId = product.storeId;
            cart.storeAvatar = store.avatar;
            cart.storeName = store.name;
            const productInfo = new product_bill_dto_1.ProductBillDto();
            productInfo.avatar = product.avatar;
            productInfo.productId = product._id;
            productInfo.productName = product.productName;
            productInfo.quantity = 1;
            productInfo.price = product.price;
            productInfo.quantityInStock = product.quantity;
            cart.listProducts = [productInfo];
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            const newCart = await this.cartModel.create(cart);
            return newCart;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByUserId(userId) {
        try {
            const carts = await this.cartModel.find({ userId }).sort({ createdAt: -1 });
            return carts;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(product, cart) {
        try {
            const productInfo = new product_bill_dto_1.ProductBillDto();
            productInfo.avatar = product.avatar;
            productInfo.productId = product._id;
            productInfo.productName = product.productName;
            productInfo.quantity = 1;
            productInfo.price = product.price;
            productInfo.quantityInStock = product.quantity;
            cart.listProducts.push(productInfo);
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            await cart.save();
            return cart;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateQuantity(product, cart) {
        try {
            cart.listProducts.map(productCart => {
                if (productCart.productId.toString() === product._id.toString()) {
                    productCart.quantity++;
                }
                return productCart;
            });
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            return await this.cartModel.findByIdAndUpdate(cart._id, cart);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async addProductIntoCart(userId, store, product) {
        const allCart = await this.getAllByUserId(userId);
        if (!allCart) {
            const newCart = await this.create(userId, store, product);
            return newCart;
        }
        else {
            const cart = allCart.find(cart => cart.storeId.toString() === product.storeId.toString());
            if (!cart) {
                const newCart = await this.create(userId, store, product);
                return newCart;
            }
            else {
                const hasProduct = cart.listProducts.find(productCart => productCart.productId.toString() === product._id.toString());
                const updatedCart = hasProduct ? await this.updateQuantity(product, cart) : await this.update(product, cart);
                return updatedCart;
            }
        }
    }
    async getByUserId(userId, pageQuery, limitQuery, searchQuery) {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const search = searchQuery
            ? {
                $or: [
                    { storeName: { $regex: searchQuery, $options: 'i' } },
                    { listProducts: { $elemMatch: { productName: { $regex: searchQuery, $options: 'i' } } } },
                ],
            }
            : {};
        const skip = limit * (page - 1);
        try {
            const total = await this.cartModel.countDocuments({ ...search, userId });
            const carts = await this.cartModel
                .find({ ...search, userId })
                .sort({ updatedAt: -1 })
                .limit(limit)
                .skip(skip);
            return { total, carts };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async removeProductInCart(userId, productId, storeId) {
        try {
            const cart = await this.cartModel.findOne({ userId, storeId });
            if (cart.listProducts.length === 1) {
                await this.cartModel.findByIdAndDelete(cart._id);
                return;
            }
            const index = cart.listProducts.findIndex(product => product.productId.toString() === productId.toString());
            cart.listProducts.splice(index, 1);
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            await cart.save();
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async removeMultiProductInCart(userId, listProduct, storeId) {
        try {
            const cart = await this.cartModel.findOne({ userId, storeId });
            listProduct.forEach(product => {
                const index = cart.listProducts.findIndex(productCart => productCart.productId.toString() === product.productId.toString());
                cart.listProducts.splice(index, 1);
            });
            if (cart.listProducts.length === 0) {
                await this.cartModel.findByIdAndDelete(cart._id);
                return;
            }
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            await cart.save();
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CartService);
//# sourceMappingURL=cart.service.js.map