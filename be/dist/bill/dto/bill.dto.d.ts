import { PAYMENT_METHOD } from "../payment/payment.gateway";
import { Store } from "../../store/schema/store.schema";
import { Product } from "../../product/schema/product.schema";
import { GiveInfo, ProductInfo, ReceiverInfo } from "./create-bill.dto";
import { User } from "../../user/schema/user.schema";
export declare class ProductFullInfo {
    product: Product;
    subInfo: ProductInfo;
}
export declare class BillDto {
    _id: string;
    storeInfo: Store;
    listProductsFullInfo: ProductFullInfo[];
    userInfo: User;
    notes: string;
    totalPrice: number;
    deliveryMethod: string;
    paymentMethod: PAYMENT_METHOD;
    receiverInfo: ReceiverInfo;
    giveInfo: GiveInfo | null;
    deliveryFee: number;
    status: string;
    isPaid: boolean;
}
