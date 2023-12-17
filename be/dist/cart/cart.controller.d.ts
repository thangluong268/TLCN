import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { ProductService } from '../product/product.service';
import { StoreService } from '../store/store.service';
import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    private readonly productService;
    private readonly storeService;
    constructor(cartService: CartService, productService: ProductService, storeService: StoreService);
    processCart(productId: string, userId: string): Promise<SuccessResponse | NotFoundException>;
    getByUserId(page: number, limit: number, search: string, userId: string): Promise<SuccessResponse>;
    getAllByUserId(userId: string): Promise<SuccessResponse>;
    removeProductInCart(productId: string, userId: string): Promise<SuccessResponse | NotFoundException>;
    getNewCartByUserId(userId: string): Promise<SuccessResponse>;
}
