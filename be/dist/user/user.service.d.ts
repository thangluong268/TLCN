/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { SignUpDto } from '../auth/dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithoutPassDto } from './dto/user-without-pass.dto';
import { User } from './schema/user.schema';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    create(signUpDto: SignUpDto): Promise<UserWithoutPassDto>;
    getByEmail(email: string): Promise<User>;
    getById(userId: string): Promise<User>;
    update(userId: string, req: UpdateUserDto): Promise<User>;
    delete(userId: string): Promise<User>;
    followStore(userId: string, storeId: string): Promise<void>;
    addFriend(userIdSend: string, userIdReceive: string): Promise<void>;
    updateWallet(userId: string, money: number, type: string): Promise<boolean>;
    updateWarningCount(userId: string, action: string): Promise<User>;
    getAll(page: number, limit: number, search: string): Promise<{
        total: number;
        users: User[];
    }>;
    updatePassword(email: string, password: string): Promise<User>;
    getFollowStoresByStoreId(storeId: string): Promise<User[]>;
    countTotalFollowStoresByStoreId(storeId: string): Promise<number>;
}
