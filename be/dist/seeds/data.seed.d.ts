import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
export declare class DataSeed {
    private readonly userService;
    private readonly roleService;
    constructor(userService: UserService, roleService: RoleService);
    hashData(data: string): Promise<string>;
    create(): Promise<void>;
}
