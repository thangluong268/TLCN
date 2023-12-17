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
exports.FineController = void 0;
const common_1 = require("@nestjs/common");
const fine_service_1 = require("./fine.service");
const create_fine_dto_1 = require("./dto/create-fine.dto");
const swagger_1 = require("@nestjs/swagger");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const role_schema_1 = require("../role/schema/role.schema");
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
let FineController = class FineController {
    constructor(fineService) {
        this.fineService = fineService;
    }
    async create(createFineDto) {
        const data = await this.fineService.create(createFineDto);
        return new success_response_1.SuccessResponse({
            message: "Tạo chính sách thành công!",
            metadata: { data },
        });
    }
    async findAll() {
        const data = await this.fineService.findAll();
        return new success_response_1.SuccessResponse({
            message: "Lấy danh sách chính sách thành công!",
            metadata: { data },
        });
    }
    async update(id, updateFineDto) {
        const result = await this.fineService.update(id, updateFineDto);
        if (!result)
            return new error_response_1.NotFoundException("Không tìm thấy chính sách này!");
        return new success_response_1.SuccessResponse({
            message: "Cập nhật chính sách thành công!",
            metadata: { data: result },
        });
    }
    async remove(id) {
        const result = await this.fineService.remove(id);
        if (!result)
            return new error_response_1.NotFoundException("Không tìm thấy chính sách này!");
        return new success_response_1.SuccessResponse({
            message: "Xóa chính sách thành công!",
            metadata: { data: result },
        });
    }
};
exports.FineController = FineController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateFineAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Post)("admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fine_dto_1.CreateFineDto]),
    __metadata("design:returntype", Promise)
], FineController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadFineAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Get)("admin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FineController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateFineAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_fine_dto_1.CreateFineDto]),
    __metadata("design:returntype", Promise)
], FineController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeleteFineAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FineController.prototype, "remove", null);
exports.FineController = FineController = __decorate([
    (0, common_1.Controller)('fine'),
    (0, swagger_1.ApiTags)('Fine'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [fine_service_1.FineService])
], FineController);
//# sourceMappingURL=fine.controller.js.map