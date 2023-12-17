import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { SuccessResponse } from '../core/success.response';
import { BadRequestException, NotFoundException } from '../core/error.response';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    addUserToRole(userId: string, roleName: CreateRoleDto): Promise<SuccessResponse | BadRequestException>;
    removeUserRole(userId: string, roleName: string): Promise<SuccessResponse | NotFoundException>;
    getRoleNameByUserId(userId: string): Promise<SuccessResponse | NotFoundException>;
}
