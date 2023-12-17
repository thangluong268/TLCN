import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AbilityFactory } from "../ability.factory";
import { RoleService } from "../../role/role.service";
export declare class AbilitiesGuard implements CanActivate {
    private reflector;
    private caslAbilityFactory;
    private roleService;
    private param;
    constructor(reflector: Reflector, caslAbilityFactory: AbilityFactory, roleService: RoleService);
    initialize(param: string): void;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
