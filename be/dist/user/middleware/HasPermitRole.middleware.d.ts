import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../../role/role.service';
import { BadRequestException } from '../../core/error.response';
export declare class HasPermitRoleMiddleware implements NestMiddleware {
    private readonly roleService;
    constructor(roleService: RoleService);
    use(req: Request, res: Response, next: NextFunction): Promise<BadRequestException>;
}
