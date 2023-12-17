import { CreateBillDto } from "../dto/create-bill.dto";
export declare enum PAYMENT_METHOD {
    VNPAY = "vnpay",
    MOMO = "momo",
    GIVE = "give"
}
export interface PaymentGateway {
    processPayment(bill: CreateBillDto): number;
}
export declare class VNPayGateway implements PaymentGateway {
    processPayment(bill: CreateBillDto): number;
}
export declare class MoMoGateway implements PaymentGateway {
    processPayment(bill: CreateBillDto): number;
}
export declare class GiveGateway implements PaymentGateway {
    processPayment(bill: CreateBillDto): number;
}
