import { CartService } from '../cart/cart.service';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { ProductService } from '../product/product.service';
import { StoreService } from '../store/store.service';
import { UserService } from '../user/user.service';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { PaymentService } from './payment/payment.service';
export declare class BillController {
    private readonly billService;
    private readonly paymentService;
    private readonly userService;
    private readonly productService;
    private readonly storeService;
    private readonly cartService;
    constructor(billService: BillService, paymentService: PaymentService, userService: UserService, productService: ProductService, storeService: StoreService, cartService: CartService);
    create(createBillDto: CreateBillDto, userId: string): Promise<SuccessResponse | NotFoundException>;
    countTotalByStatusSeller(year: number, userId: string): Promise<SuccessResponse | NotFoundException>;
    countTotalByStatusUser(userId: string): Promise<SuccessResponse | NotFoundException>;
    calculateRevenueByYear(year: number, userId: string): Promise<SuccessResponse | NotFoundException>;
    countCharityByYear(year: number, userId: string): Promise<SuccessResponse | NotFoundException>;
    getAllByStatusUser(page: number, limit: number, status: string, userId: string): Promise<SuccessResponse | NotFoundException>;
    getAllByStatusSeller(page: number, limit: number, status: string, userId: string): Promise<SuccessResponse | NotFoundException>;
    getMyBill(id: string, userId: string): Promise<SuccessResponse | NotFoundException>;
    cancelBill(id: string, userId: string): Promise<SuccessResponse | NotFoundException>;
    updateStatus(id: string, status: string): Promise<SuccessResponse | NotFoundException>;
}
