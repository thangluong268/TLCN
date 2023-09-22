import { Injectable } from '@nestjs/common';
import { ACTION_CART, ActionCartGateway } from './gateway/action-cart.gateway';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { Model, MongooseError, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { CreateCartDto } from './dto/cart-create.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { ProductBillDto } from 'src/bill/dto/product-bill.dto';
import { UpdateCartDto } from './dto/cart-update.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name)
        private readonly cartModel: Model<Cart>
    ) { }

    private actionCartGateways: Record<string, ActionCartGateway> = {};

    public registerActionGateway(action: ACTION_CART, gateway: ActionCartGateway) {
        this.actionCartGateways[action] = gateway;
    }

    public async processAction(
        userId: Types.ObjectId,
        cart: CreateCartDto,
        storeId: Types.ObjectId,
        action: ACTION_CART): Promise<Cart | boolean> {
        const gateway = this.actionCartGateways[action];
        if (gateway) {
            return await gateway.processAction(userId, cart, storeId);
        } else {
            throw new NotFoundExceptionCustom("Action");
        }
    }

    getTotalPrice(listProducts: ProductBillDto[]): number {
        const totalPrice = listProducts.reduce((total: number, product: ProductBillDto) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0)
        return totalPrice
    }

    async create(
        userId: Types.ObjectId,
        cart: CreateCartDto,
        storeId: Types.ObjectId,): Promise<Cart> {
        try {
            const newCart = await this.cartModel.create(cart)
            newCart.userId = new Types.ObjectId(userId)
            newCart.storeId = new Types.ObjectId(storeId)
            newCart.totalPrice = this.getTotalPrice(cart.listProducts)
            await newCart.save()
            return newCart
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async deleteByUserIdAndStoreId(userId: Types.ObjectId, storeId: Types.ObjectId): Promise<boolean> {
        try {
            const result = await this.cartModel.deleteOne({ userId, storeId })
            return result.deletedCount > 0
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async updateByUserIdAndStoreId(userId: Types.ObjectId, storeId: Types.ObjectId, cart: CreateCartDto): Promise<boolean> {
        try {
            const totalPrice = this.getTotalPrice(cart.listProducts)
            const result = await this.cartModel.updateOne({ userId, storeId }, { totalPrice, listProducts: cart.listProducts })
            console.log(result)
            return result.modifiedCount > 0
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getByUserId(userId: Types.ObjectId, pageQuery: number, limitQuery: number, searchQuery: string)
        : Promise<{ total: number, carts: Cart[] }> {
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
        const skip = limit * (page - 1)
        try {
            const total = await this.cartModel.countDocuments({ ...search, userId })
            const carts = await this.cartModel.find({ ...search, userId }).limit(limit).skip(skip)
            return { total, carts }
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
