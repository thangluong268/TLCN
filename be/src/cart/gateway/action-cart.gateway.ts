import { Model, Types } from "mongoose"
import { Cart } from "../schema/cart.schema"
import { CreateCartDto } from "../dto/cart-create.dto"
import { CartService } from "../cart.service"
import { UpdateCartDto } from "../dto/cart-update.dto";

export enum ACTION_CART {
    ADD = 'add',
    UPDATE = 'update',
}

export interface ActionCartGateway {
    processAction(userId: Types.ObjectId, cart: CreateCartDto, storeId: Types.ObjectId): Promise<Cart | boolean>;
}

export class AddCartGateway implements ActionCartGateway {
    constructor(protected readonly cartService: CartService) { }
    async processAction(userId: Types.ObjectId, cart: CreateCartDto, storeId: Types.ObjectId): Promise<Cart> {
        const newCart = await this.cartService.create(userId, cart, storeId)
        return newCart
    }
}

export class UpdateCartGateway implements ActionCartGateway {
    constructor(protected readonly cartService: CartService) { }
    async processAction(userId: Types.ObjectId, cart: CreateCartDto, storeId: Types.ObjectId): Promise<boolean> {
        if (cart.listProducts.length === 0) {
            const result = await this.cartService.deleteByUserIdAndStoreId(userId, storeId)
            return result
        }
        const result = await this.cartService.updateByUserIdAndStoreId(userId, storeId, cart)
        return result
    }
}
