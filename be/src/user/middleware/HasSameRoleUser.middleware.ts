import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model, MongooseError, Types } from 'mongoose';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { User } from '../schema/user.schema';
import { Role } from 'src/role/schema/role.schema';
import { RoleService } from 'src/role/role.service';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class HasSameRoleUserMiddleware implements NestMiddleware {
    constructor(private readonly roleService: RoleService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.params.id) {
            try {
                const id1 = new Types.ObjectId(req.params.id)
                const id2 = new Types.ObjectId(req.body.friendId)

                const role1 = await this.roleService.getRoleNameByUserId(id1)
                const role2 = await this.roleService.getRoleNameByUserId(id2)

                if (!role1 || !role2) { throw new NotFoundExceptionCustom(Role.name) }
                if (role1 != "User" || role2 != "User") {
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
