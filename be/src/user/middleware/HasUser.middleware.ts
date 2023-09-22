import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { User } from '../schema/user.schema';
import { Model, MongooseError } from 'mongoose';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class HasUserMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.params.id) {
            try {
                const user = await this.userModel.findById(req.params.id)
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
