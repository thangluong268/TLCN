import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { BadRequestException } from '../../core/error.response';
import { InternalServerErrorExceptionCustom } from '../../exceptions/InternalServerErrorExceptionCustom.exception';
import { RoleService } from '../../role/role.service';
import { RoleName } from '../../role/schema/role.schema';

@Injectable()
export class HasPermitRoleMiddleware implements NestMiddleware {
  constructor(private readonly roleService: RoleService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.params.id) {
      try {
        const id = req.params.id;
        const roles = await this.roleService.getRoleNameByUserId(id);
        if (!roles) {
          return new BadRequestException('Bạn không có quyền thực hiện hành động này!');
        }
        if (roles.includes(RoleName.ADMIN) || roles.includes(RoleName.MANAGER_USER)) {
          return new BadRequestException('Bạn không có quyền thực hiện hành động này!');
        }
      } catch (err) {
        if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
        throw err;
      }
    }
    next();
  }
}
