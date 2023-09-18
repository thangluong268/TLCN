import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}
    
    async create(signUpDto: SignUpDto): Promise<User> {
        const newUser = await this.userModel.create(signUpDto)
        return newUser
    }

    async getByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email})
        if(!user){ throw new NotFoundExceptionCustom(User.name) }
        return user
    }

    async getById(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId)
        if(!user){ throw new NotFoundExceptionCustom(User.name) }
        return user
    }
}
