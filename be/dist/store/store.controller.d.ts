import { BadRequestException, ConflictException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { FeedbackService } from '../feedback/feedback.service';
import { ProductService } from '../product/product.service';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './store.service';
export declare class StoreController {
    private readonly storeService;
    private readonly userService;
    private readonly roleService;
    private readonly feedbackService;
    private readonly productService;
    constructor(storeService: StoreService, userService: UserService, roleService: RoleService, feedbackService: FeedbackService, productService: ProductService);
    create(store: CreateStoreDto, userId: string): Promise<SuccessResponse | NotFoundException | ConflictException | BadRequestException>;
    getMyStore(userId: string): Promise<SuccessResponse | NotFoundException>;
    getReputation(storeId: string): Promise<SuccessResponse | NotFoundException>;
    getListStoreHaveMostProducts(limit: number): Promise<SuccessResponse | NotFoundException>;
    getById(id: string): Promise<SuccessResponse | NotFoundException>;
    delete(userId: string): Promise<SuccessResponse | NotFoundException | BadRequestException>;
    update(store: UpdateStoreDto, userId: string): Promise<SuccessResponse | NotFoundException>;
    updateWarningCount(id: string, action: string): Promise<SuccessResponse | NotFoundException>;
}
