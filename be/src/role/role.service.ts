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
        const newRole = await this.roleModel.create(role)
        return newRole
    }

    async addUserToRole(userId: string, roleName: CreateRoleDto): Promise<boolean> {
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

    async getByName(roleName: string): Promise<Role> {
        const role = await this.roleModel.findOne({ name: roleName })
        return role
    }

    async addUserIntoListUser(roleId: string, userId: string): Promise<boolean> {
        const result = await this.roleModel.findByIdAndUpdate(roleId, { $push: { listUser: userId } })
        if (!result) { throw new NotFoundExceptionCustom(Role.name) }
        return true
    }

    async removeUserRole(userId: string): Promise<boolean> {
        // check user is in listUser of any role, listUde is array of userId
        const role = await this.roleModel.findOne({ listUser: userId })
        if (!role) { throw new NotFoundExceptionCustom(Role.name) }
        // remove user from listUser of role
        const result = await this.roleModel.findByIdAndUpdate(role._id, { $pull: { listUser: userId } })
        if (!result) return false
        return true
    }

    async getRoleNameByUserId(userId: string): Promise<string> {
        try{
            const roles = await this.roleModel.findOne({ listUser: userId })
            if (!roles) { throw new NotFoundExceptionCustom(Role.name) }
            return roles.name
        }
        catch(err){
            if(err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getByUserId(userId: string): Promise<any> {
        const role = await this.roleModel.findOne({ listUser: userId })
        return role
    }

}
