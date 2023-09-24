import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model, MongooseError, Types } from 'mongoose';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { User } from '../schema/user.schema';
import { Role, RoleName } from 'src/role/schema/role.schema';
import { RoleService } from 'src/role/role.service';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class HasSameRoleUserMiddleware implements NestMiddleware {
    constructor(private readonly roleService: RoleService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.params.id) {
            try {
                const id1 = req.params.id
                const id2 = req.body.id
                console.log(id2)

                const role1 = await this.roleService.getRoleNameByUserId(id1)
                console.log(role1)
                const role2 = await this.roleService.getRoleNameByUserId(id2)
                console.log(role2)

                if (!role1 || !role2) { throw new NotFoundExceptionCustom(Role.name) }
                if (role1 != RoleName.USER || role2 != RoleName.USER) {
                    throw new NotFoundExceptionCustom(User.name)
                }
            }
            catch (err) {
                if (err instanceof MongooseError)
                    throw new InternalServerErrorExceptionCustom()
                throw err
            }
        }
        console.log("Pass HasSameRoleUserMiddleware")
        next();
    }
}
