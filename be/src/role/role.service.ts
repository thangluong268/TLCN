import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';

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
        if (!role) { throw new NotFoundException("Role not found") }
        // check user is in listUser of any role
        const userHasRole = await this.getByUserId(userId)
        if (userHasRole) {
            throw new ConflictException("User is already has a role")
        }
        const result = await this.addUserIntoListUser(role._id, userId)
        return result
    }

    async getByName(roleName: string): Promise<Role> {
        const role = await this.roleModel.findOne({ name: roleName })
        return role
    }

    async addUserIntoListUser(roleId: string, userId: string): Promise<boolean> {
        const result = await this.roleModel.findByIdAndUpdate('test', { $push: { listUser: userId } })
        if (!result) { throw new NotFoundException("User not found in role") }
        return true
    }

    async removeUserRole(userId: string): Promise<boolean> {
        // check user is in listUser of any role, listUde is array of userId
        const role = await this.roleModel.findOne({ listUser: userId })
        if (!role) throw new NotFoundException("User is not in any role")
        // remove user from listUser of role
        const result = await this.roleModel.findByIdAndUpdate(role._id, { $pull: { listUser: userId } })
        if (!result) return false
        return true
    }

    async getRoleNameByUserId(userId: string): Promise<string> {
        const role = await this.roleModel.findOne({ listUser: userId })
        if (!role) { throw new NotFoundException("User is not in any role") }
        return role.name
    }

    async getByUserId(userId: string): Promise<any> {
        const role = await this.roleModel.findOne({ listUser: userId })
        return role
    }

}
