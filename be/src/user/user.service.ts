import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { UserWithoutPassDto } from './dto/user-without-pass.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) { }

    async create(signUpDto: SignUpDto): Promise<UserWithoutPassDto> {
        try {
            const newUser = await this.userModel.create(signUpDto)
            const userDoc = newUser['_doc']
            const {password, ...userWithoutPass} = userDoc
            return userWithoutPass
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }

    }

    async getByEmail(email: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ email })
            if (!user) { throw new NotFoundExceptionCustom(User.name) }
            return user
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getById(userId: Types.ObjectId): Promise<User> {
        try {
            const user = await this.userModel.findById(userId)
            if (!user) { throw new NotFoundExceptionCustom(User.name) }
            return user
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
