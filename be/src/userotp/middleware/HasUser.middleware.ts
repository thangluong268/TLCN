import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { Userotp } from '../schema/userotp.schema';
import { MongooseError, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class HasUserMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(Userotp.name)
        private readonly userService: UserService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.params.id) {
            try {
                const user = await this.userService.getById(req.params.id)
                if (!user) { throw new NotFoundExceptionCustom(User.name) }
            }
            catch (err) {
                if (err instanceof MongooseError)
                    throw new InternalServerErrorExceptionCustom()
                throw err
            }
        }
        console.log("Pass HasUserMiddleware")
        next();
    }
}
