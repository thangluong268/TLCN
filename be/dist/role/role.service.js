"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
const role_schema_1 = require("./schema/role.schema");
let RoleService = class RoleService {
    constructor(roleModel) {
        this.roleModel = roleModel;
    }
    async create(role) {
        try {
            const newRole = await this.roleModel.create(role);
            return newRole;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async addUserToRole(userId, roleName) {
        try {
            const role = await this.getByName(roleName.name);
            if (!role) {
                return false;
            }
            const roleNames = await this.getRoleNameByUserId(userId);
            if (!roleNames) {
                return await this.addUserIntoListUser(role._id, userId);
            }
            if (roleNames.includes(role_schema_1.RoleName.USER) && roleName.name == role_schema_1.RoleName.SELLER) {
                return await this.addUserIntoListUser(role._id, userId);
            }
            else {
                return false;
            }
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getByName(roleName) {
        try {
            const role = await this.roleModel.findOne({ name: roleName });
            return role;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async addUserIntoListUser(roleId, userId) {
        try {
            const result = await this.roleModel.findByIdAndUpdate(roleId, { $push: { listUser: userId } });
            if (!result) {
                return false;
            }
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async removeUserRole(userId, name) {
        try {
            const role = await this.roleModel.findOne({ name, listUser: userId });
            if (!role) {
                return false;
            }
            const result = await this.roleModel.findByIdAndUpdate(role._id, { $pull: { listUser: userId } });
            if (!result)
                return false;
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getRoleNameByUserId(userId) {
        try {
            const role = await this.roleModel.find({ listUser: userId });
            if (!role) {
                return '';
            }
            const roleName = role.map(role => role.name).join(' - ');
            return roleName;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getByUserId(userId) {
        try {
            const role = await this.roleModel.findOne({ listUser: userId });
            return role;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RoleService);
//# sourceMappingURL=role.service.js.map