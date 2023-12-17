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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const get_current_userid_decorator_1 = require("../auth/decorators/get-current-userid.decorator");
const bill_service_1 = require("../bill/bill.service");
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const role_service_1 = require("../role/role.service");
const role_schema_1 = require("../role/schema/role.schema");
const store_service_1 = require("../store/store.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService, roleService, billService, storeService) {
        this.userService = userService;
        this.roleService = roleService;
        this.billService = billService;
        this.storeService = storeService;
    }
    async findOne(id) {
        const user = await this.userService.getById(id);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const billsOfUser = await this.billService.getAllByUserId(id);
        const totalBills = billsOfUser.length;
        const totalPricePaid = billsOfUser.reduce((total, bill) => total + bill.totalPrice, 0);
        const totalReceived = billsOfUser.filter(bill => bill.totalPrice === 0).length;
        const data = {
            ...user.toObject(),
            totalBills,
            totalPricePaid,
            totalReceived,
        };
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin người dùng thành công!',
            metadata: { data },
        });
    }
    async followStore(storeId, userId) {
        const store = await this.storeService.getById(storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        if (store.userId.toString() === userId)
            return new error_response_1.BadRequestException('Bạn không thể theo dõi cửa hàng của chính mình!');
        await this.userService.followStore(userId, storeId);
        return new success_response_1.SuccessResponse({
            message: 'Follow cửa hàng thành công!',
            metadata: { data: {} },
        });
    }
    async addFriend(userIdReceive, userIdSend) {
        const user = await this.userService.getById(userIdReceive);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        if (userIdReceive === userIdSend)
            return new error_response_1.BadRequestException('Bạn không thể kết bạn với chính mình!');
        await this.userService.addFriend(userIdSend, userIdReceive);
        return new success_response_1.SuccessResponse({
            message: 'Follow cửa hàng thành công!',
            metadata: { data: {} },
        });
    }
    async delete(id) {
        const user = await this.userService.delete(id);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        return new success_response_1.SuccessResponse({
            message: 'Xóa người dùng thành công!',
            metadata: { data: user },
        });
    }
    async updateWarningCount(id, action) {
        const user = await this.userService.updateWarningCount(id, action);
        if (!user)
            return new error_response_1.BadRequestException('Không thể cập nhật số lần vi phạm!');
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật số lần vi phạm thành công!',
            metadata: { data: user },
        });
    }
    async getAll(page, limit, search) {
        const data = await this.userService.getAll(page, limit, search);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách người dùng thành công!',
            metadata: { data },
        });
    }
    async update(id, updateUserDto, userId) {
        const currentUserRole = await this.roleService.getRoleNameByUserId(userId);
        if (currentUserRole.includes(role_schema_1.RoleName.USER) && id !== userId) {
            return new error_response_1.ForbiddenException('Bạn không có quyền cập nhật thông tin người dùng khác!');
        }
        const updatedUser = await this.userService.update(id, updateUserDto);
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật thông tin người dùng thành công!',
            metadata: { data: updatedUser },
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER, role_schema_1.RoleName.ADMIN),
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'storeId', type: String, required: true }),
    (0, common_1.Put)('user-follow-store'),
    __param(0, (0, common_1.Query)('storeId')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "followStore", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'userIdReceive', type: String, required: true }),
    (0, common_1.Put)('user-add-friend'),
    __param(0, (0, common_1.Query)('userIdReceive')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFriend", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeleteUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER, role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Put)('manager/warningcount/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateWarningCount", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Get)('admin'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER, role_schema_1.RoleName.ADMIN),
    (0, common_1.Patch)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('User'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        role_service_1.RoleService,
        bill_service_1.BillService,
        store_service_1.StoreService])
], UserController);
//# sourceMappingURL=user.controller.js.map