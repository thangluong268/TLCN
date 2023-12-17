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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const success_response_1 = require("../core/success.response");
const role_schema_1 = require("../role/schema/role.schema");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(createCategoryDto) {
        const data = await this.categoryService.create(createCategoryDto);
        return new success_response_1.SuccessResponse({
            message: 'Tạo danh mục thành công!',
            metadata: { data },
        });
    }
    async findAllByCategoryName(id, status) {
        const data = await this.categoryService.findAllByCategoryName(id, status);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách danh mục thành công!',
            metadata: { data },
        });
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateCategoryAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Post)('manager'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(''),
    (0, swagger_1.ApiQuery)({ name: 'id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAllByCategoryName", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('category'),
    (0, swagger_1.ApiTags)('Category'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map