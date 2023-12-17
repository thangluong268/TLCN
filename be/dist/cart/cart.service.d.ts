/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { ProductInfo } from '../bill/dto/create-bill.dto';
import { ProductBillDto } from '../bill/dto/product-bill.dto';
import { Product } from '../product/schema/product.schema';
import { Store } from '../store/schema/store.schema';
import { Cart } from './schema/cart.schema';
export declare class CartService {
    private readonly cartModel;
    constructor(cartModel: Model<Cart>);
    getTotalPrice(listProducts: ProductBillDto[]): number;
    create(userId: string, store: Store, product: Product): Promise<Cart>;
    getAllByUserId(userId: string): Promise<Cart[]>;
    update(product: Product, cart: Cart): Promise<Cart>;
    updateQuantity(product: Product, cart: Cart): Promise<Cart>;
    addProductIntoCart(userId: string, store: Store, product: Product): Promise<Cart | boolean>;
    getByUserId(userId: string, pageQuery: number, limitQuery: number, searchQuery: string): Promise<{
        total: number;
        carts: Cart[];
    }>;
    removeProductInCart(userId: string, productId: string, storeId: string): Promise<void>;
    removeMultiProductInCart(userId: string, listProduct: ProductInfo[], storeId: string): Promise<void>;
}
