import { PaymentGateway, PAYMENT_METHOD } from './payment.gateway';
import { CreateBillDto } from '../dto/create-bill.dto';
export declare class PaymentService {
    private paymentGateways;
    registerPaymentGateway(paymentMethod: PAYMENT_METHOD, gateway: PaymentGateway): void;
    processPayment(bill: CreateBillDto, paymentMethod: PAYMENT_METHOD): Promise<number>;
}
