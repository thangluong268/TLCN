import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../../role/role.service';
import { ForbiddenException } from '../../core/error.response';
export declare class HasSameRoleUserMiddleware implements NestMiddleware {
    private readonly roleService;
    constructor(roleService: RoleService);
    use(req: Request, res: Response, next: NextFunction): Promise<ForbiddenException>;
}
