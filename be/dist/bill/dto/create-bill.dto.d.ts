import { PAYMENT_METHOD } from "../payment/payment.gateway";
export declare class ProductInfo {
    productId: string;
    quantity: number;
    type: string;
}
export declare class CartInfo {
    storeId: string;
    listProducts: ProductInfo[];
    notes: string;
    totalPrice: number;
}
export declare class ReceiverInfo {
    fullName: string;
    phoneNumber: string;
    address: string;
}
export declare class GiveInfo {
    senderName: string;
    wish: string;
}
export declare class CreateBillDto {
    data: CartInfo[];
    deliveryMethod: string;
    paymentMethod: PAYMENT_METHOD;
    receiverInfo: ReceiverInfo;
    giveInfo: GiveInfo | null;
    deliveryFee: number;
}
