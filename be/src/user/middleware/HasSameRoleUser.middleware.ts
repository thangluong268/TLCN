import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { ForbiddenException } from '../../core/error.response';
import { InternalServerErrorExceptionCustom } from '../../exceptions/InternalServerErrorExceptionCustom.exception';
import { RoleService } from '../../role/role.service';
import { RoleName } from '../../role/schema/role.schema';

@Injectable()
export class HasSameRoleUserMiddleware implements NestMiddleware {
  constructor(private readonly roleService: RoleService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.params.id) {
      try {
        const id1 = req.params.id;
        const id2 = req.body.id;

        const roles1 = await this.roleService.getRoleNameByUserId(id1);
        const roles2 = await this.roleService.getRoleNameByUserId(id2);

        if (!roles1 || !roles2) {
          return new ForbiddenException('Bạn không có quyền thực hiện hành động này!');
        }
        if (roles1.includes(RoleName.USER) || roles2.includes(RoleName.USER)) {
          {
            return new ForbiddenException('Bạn không có quyền thực hiện hành động này!');
          }
        }
      } catch (err) {
        if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
        throw err;
      }
    }
    console.log('Pass HasSameRoleUserMiddleware');
    next();
  }
}
