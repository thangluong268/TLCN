import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
        if(!user){ throw new NotFoundException("User not found") }
        return user
    }

    async getById(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId)
        if(!user){ throw new NotFoundException("User not found") }
        return user
    }
}
