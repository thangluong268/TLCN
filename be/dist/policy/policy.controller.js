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
exports.PolicyController = void 0;
const common_1 = require("@nestjs/common");
const policy_service_1 = require("./policy.service");
const create_policy_dto_1 = require("./dto/create-policy.dto");
const swagger_1 = require("@nestjs/swagger");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const role_schema_1 = require("../role/schema/role.schema");
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
let PolicyController = class PolicyController {
    constructor(policyService) {
        this.policyService = policyService;
    }
    async create(createPolicyDto) {
        const data = await this.policyService.create(createPolicyDto);
        return new success_response_1.SuccessResponse({
            message: "Tạo chính sách thành công!",
            metadata: { data },
        });
    }
    async findAll() {
        const data = await this.policyService.findAll();
        return new success_response_1.SuccessResponse({
            message: "Lấy danh sách chính sách thành công!",
            metadata: { data },
        });
    }
    async update(id, updateFineDto) {
        const data = await this.policyService.update(id, updateFineDto);
        if (!data)
            return new error_response_1.NotFoundException("Không tìm thấy chính sách này!");
        return new success_response_1.SuccessResponse({
            message: "Cập nhật chính sách thành công!",
            metadata: { data },
        });
    }
    async remove(id) {
        const data = await this.policyService.remove(id);
        if (!data)
            return new error_response_1.NotFoundException("Không tìm thấy chính sách này!");
        return new success_response_1.SuccessResponse({
            message: "Xóa chính sách thành công!",
            metadata: { data },
        });
    }
};
exports.PolicyController = PolicyController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreatePolicyAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Post)("admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_policy_dto_1.CreatePolicyDto]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadPolicyAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Get)("admin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdatePolicyAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_policy_dto_1.CreatePolicyDto]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeletePolicyAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "remove", null);
exports.PolicyController = PolicyController = __decorate([
    (0, common_1.Controller)('policy'),
    (0, swagger_1.ApiTags)('Policy'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [policy_service_1.PolicyService])
], PolicyController);
//# sourceMappingURL=policy.controller.js.map