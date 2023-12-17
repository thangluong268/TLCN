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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSeed = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const role_service_1 = require("../role/role.service");
const role_schema_1 = require("../role/schema/role.schema");
const nestjs_command_1 = require("nestjs-command");
const bcrypt = require("bcrypt");
const signup_dto_1 = require("../auth/dto/signup.dto");
const create_role_dto_1 = require("../role/dto/create-role.dto");
let DataSeed = class DataSeed {
    constructor(userService, roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }
    async hashData(data) {
        const saltOrRounds = Number(process.env.SALT_ROUNDS);
        return await bcrypt.hash(data, saltOrRounds);
    }
    async create() {
        await this.roleService.create({
            name: role_schema_1.RoleName.ADMIN
        });
        await this.roleService.create({
            name: role_schema_1.RoleName.USER
        });
        await this.roleService.create({
            name: role_schema_1.RoleName.SELLER
        });
        await this.roleService.create({
            name: role_schema_1.RoleName.MANAGER
        });
        const userInfo = new signup_dto_1.SignUpDto();
        userInfo.fullName = "admin";
        userInfo.email = process.env.EMAIL_ADMIN;
        userInfo.password = await this.hashData(process.env.PASSWORD_ADMIN);
        const user = await this.userService.create(userInfo);
        const adminRole = new create_role_dto_1.CreateRoleDto();
        adminRole.name = role_schema_1.RoleName.ADMIN;
        await this.roleService.addUserToRole(user._id, adminRole);
    }
};
exports.DataSeed = DataSeed;
__decorate([
    (0, nestjs_command_1.Command)({ command: 'create:data', describe: 'create a role and add user to role Admin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataSeed.prototype, "create", null);
exports.DataSeed = DataSeed = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        role_service_1.RoleService])
], DataSeed);
//# sourceMappingURL=data.seed.js.map