import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model, MongooseError, ObjectId, Types } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { ConflictExceptionCustom } from 'src/exceptions/ConflictExceptionCustom.exception';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name)
        private readonly roleModel: Model<Role>
    ) { }

    async create(role: CreateRoleDto): Promise<Role> {
        try {
            const newRole = await this.roleModel.create(role)
            return newRole
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async addUserToRole(userId: Types.ObjectId, roleName: CreateRoleDto): Promise<boolean> {
        try {
            // check role is exist
            const role = await this.getByName(roleName.name)
            if (!role) { throw new NotFoundExceptionCustom(Role.name) }
            // check user is in listUser of any role
            const userHasRole = await this.getByUserId(userId)
            if (userHasRole) {
                throw new ConflictExceptionCustom(Role.name)
            }
            const result = await this.addUserIntoListUser(role._id, userId)
            return result
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }

    }

    async getByName(roleName: string): Promise<Role> {
        try {
            const role = await this.roleModel.findOne({ name: roleName })
            return role
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async addUserIntoListUser(roleId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
        try {
            const result = await this.roleModel.findByIdAndUpdate(roleId, { $push: { listUser: userId } })
            if (!result) { throw new NotFoundExceptionCustom(Role.name) }
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async removeUserRole(userId: string): Promise<boolean> {
        try {
            // check user is in listUser of any role, listUde is array of userId
            const role = await this.roleModel.findOne({ listUser: userId })
            if (!role) { throw new NotFoundExceptionCustom(Role.name) }
            // remove user from listUser of role
            const result = await this.roleModel.findByIdAndUpdate(role._id, { $pull: { listUser: userId } })
            if (!result) return false
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }

    }

    async getRoleNameByUserId(userId: Types.ObjectId): Promise<string> {
        try {
            const role = await this.roleModel.findOne({ listUser: userId })
            if (!role) { throw new NotFoundExceptionCustom(Role.name) }
            return role.name
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getByUserId(userId: Types.ObjectId): Promise<any> {
        try {
            const role = await this.roleModel.findOne({ listUser: userId })
            return role
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
