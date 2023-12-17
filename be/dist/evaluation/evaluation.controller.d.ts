import { BillService } from '../bill/bill.service';
import { NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { StoreService } from '../store/store.service';
import { UserService } from '../user/user.service';
import { EvaluationDto } from './dto/body.dto';
import { EvaluationService } from './evaluation.service';
export declare class EvaluationController {
    private readonly evaluationService;
    private readonly notificationService;
    private readonly productService;
    private readonly userService;
    private readonly storeService;
    private readonly billService;
    constructor(evaluationService: EvaluationService, notificationService: NotificationService, productService: ProductService, userService: UserService, storeService: StoreService, billService: BillService);
    create(productId: string, evaluationDto: EvaluationDto, userId: string): Promise<SuccessResponse | NotFoundException>;
    getByProductId(productId: string, userId: string): Promise<SuccessResponse | NotFoundException>;
}
