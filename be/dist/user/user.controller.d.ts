import { BillService } from '../bill/bill.service';
import { BadRequestException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { RoleService } from '../role/role.service';
import { StoreService } from '../store/store.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    private readonly roleService;
    private readonly billService;
    private readonly storeService;
    constructor(userService: UserService, roleService: RoleService, billService: BillService, storeService: StoreService);
    findOne(id: string): Promise<SuccessResponse | NotFoundException>;
    followStore(storeId: string, userId: string): Promise<SuccessResponse | NotFoundException | BadRequestException>;
    addFriend(userIdReceive: string, userIdSend: string): Promise<SuccessResponse | NotFoundException | BadRequestException>;
    delete(id: string): Promise<SuccessResponse | NotFoundException>;
    updateWarningCount(id: string, action: string): Promise<SuccessResponse | BadRequestException>;
    getAll(page: number, limit: number, search: string): Promise<SuccessResponse>;
    update(id: string, updateUserDto: UpdateUserDto, userId: string): Promise<SuccessResponse | NotFoundException>;
}
