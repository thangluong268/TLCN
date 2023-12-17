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
exports.PromotionController = void 0;
const common_1 = require("@nestjs/common");
const promotion_service_1 = require("./promotion.service");
const create_promotion_dto_1 = require("./dto/create-promotion.dto");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const role_schema_1 = require("../role/schema/role.schema");
const swagger_1 = require("@nestjs/swagger");
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
let PromotionController = class PromotionController {
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    async create(createPromotionDto) {
        const data = await this.promotionService.create(createPromotionDto);
        return new success_response_1.SuccessResponse({
            message: "Tạo chương trình khuyến mãi thành công!",
            metadata: { data },
        });
    }
    async findAllByProductType(productType) {
        const data = await this.promotionService.findAllByProductType(productType);
        return new success_response_1.SuccessResponse({
            message: "Lấy danh sách chương trình khuyến mãi thành công!",
            metadata: { data },
        });
    }
    async update(id, updatePromotionDto) {
        const data = await this.promotionService.update(id, updatePromotionDto);
        if (!data)
            return new error_response_1.NotFoundException("Không tìm thấy chương trình khuyến mãi này!");
        return new success_response_1.SuccessResponse({
            message: "Cập nhật chương trình khuyến mãi thành công!",
            metadata: { data },
        });
    }
    async remove(id) {
        const data = await this.promotionService.remove(id);
        if (!data)
            return new error_response_1.NotFoundException("Không tìm thấy chương trình khuyến mãi này!");
        return new success_response_1.SuccessResponse({
            message: "Xóa chương trình khuyến mãi thành công!",
            metadata: { data },
        });
    }
};
exports.PromotionController = PromotionController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreatePromotionAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Post)("manager"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promotion_dto_1.CreatePromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadPromotionAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Get)('manager'),
    (0, swagger_1.ApiQuery)({ name: 'productType', type: String, required: false }),
    __param(0, (0, common_1.Query)('productType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "findAllByProductType", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdatePromotionAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Put)('manager/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_promotion_dto_1.CreatePromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeletePromotionAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Delete)('manager/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "remove", null);
exports.PromotionController = PromotionController = __decorate([
    (0, common_1.Controller)('promotion'),
    (0, swagger_1.ApiTags)('Promotion'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [promotion_service_1.PromotionService])
], PromotionController);
//# sourceMappingURL=promotion.controller.js.map