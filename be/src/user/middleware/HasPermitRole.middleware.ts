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
export class HasPermitRoleMiddleware implements NestMiddleware {
    constructor(private readonly roleService: RoleService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.params.id) {
            try {
                const id = new Types.ObjectId(req.params.id)
                const role = await this.roleService.getRoleNameByUserId(id)
                if (!role) { throw new NotFoundExceptionCustom(Role.name) }
                if (role == 'Admin' || role == 'Manager') {
                    throw new NotFoundExceptionCustom(User.name)
                }
            }
            catch (err) {
                if (err instanceof MongooseError)
                    throw new InternalServerErrorExceptionCustom()
                throw err
            }

        }
        console.log("Pass HasPermitRoleMiddleware")
        next();
    }
}
