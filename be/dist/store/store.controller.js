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
exports.StoreController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const get_current_userid_decorator_1 = require("../auth/decorators/get-current-userid.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const feedback_service_1 = require("../feedback/feedback.service");
const product_service_1 = require("../product/product.service");
const role_service_1 = require("../role/role.service");
const role_schema_1 = require("../role/schema/role.schema");
const user_service_1 = require("../user/user.service");
const create_store_dto_1 = require("./dto/create-store.dto");
const update_store_dto_1 = require("./dto/update-store.dto");
const store_service_1 = require("./store.service");
let StoreController = class StoreController {
    constructor(storeService, userService, roleService, feedbackService, productService) {
        this.storeService = storeService;
        this.userService = userService;
        this.roleService = roleService;
        this.feedbackService = feedbackService;
        this.productService = productService;
    }
    async create(store, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const hasStore = await this.storeService.getByUserId(userId);
        if (hasStore)
            return new error_response_1.ConflictException('Người dùng này đã có cửa hàng!');
        const newStore = await this.storeService.create(userId, store);
        if (!newStore)
            return new error_response_1.BadRequestException('Tạo cửa hàng thất bại!');
        const resultAddRole = await this.roleService.addUserToRole(userId, { name: role_schema_1.RoleName.SELLER });
        if (!resultAddRole)
            return new error_response_1.BadRequestException('Thêm quyền thất bại!');
        return new success_response_1.SuccessResponse({
            message: 'Tạo cửa hàng thành công!',
            metadata: { data: newStore },
        });
    }
    async getMyStore(userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin cửa hàng thành công!',
            metadata: { data: store },
        });
    }
    async getReputation(storeId) {
        const store = await this.storeService.getById(storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const products = await this.productService.getProductsByStoreId(storeId);
        let totalFeedback = 0;
        let totalProductsHasFeedback = 0;
        let totalAverageStar = 0;
        let averageStar = 0;
        await Promise.all(products.map(async (product) => {
            const feedbacks = await this.feedbackService.getAllByProductId(product._id);
            if (feedbacks.length === 0)
                return;
            totalFeedback += feedbacks.length;
            const star = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            feedbacks.forEach(feedback => {
                star[feedback.star]++;
            });
            let averageStar = 0;
            Object.keys(star).forEach(key => {
                averageStar += star[key] * Number(key);
            });
            averageStar = Number((averageStar / feedbacks.length).toFixed(2));
            totalAverageStar += averageStar;
            totalProductsHasFeedback++;
        }));
        if (totalProductsHasFeedback !== 0)
            averageStar = Number((totalAverageStar / totalProductsHasFeedback).toFixed(2));
        const totalFollow = await this.userService.countTotalFollowStoresByStoreId(storeId);
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin độ uy tín cửa hàng thành công!',
            metadata: { averageStar, totalFeedback, totalFollow },
        });
    }
    async getListStoreHaveMostProducts(limit) {
        const stores = await this.productService.getListStoreHaveMostProducts(Number(limit));
        const data = await Promise.all(stores.map(async (item) => {
            let store = await this.storeService.getById(item._id);
            if (!store)
                throw new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
            store = store.toObject();
            delete store.status;
            delete store.__v;
            delete store['createdA'];
            delete store['updatedAt'];
            return { store, totalProducts: item.count };
        }));
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin danh sách cửa hàng có nhiều sản phẩm nhất thành công!',
            metadata: { data },
        });
    }
    async getById(id) {
        const store = await this.storeService.getById(id);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        delete store.__v;
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin cửa hàng thành công!',
            metadata: { data: store },
        });
    }
    async delete(userId) {
        const result = await this.storeService.delete(userId);
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const isDeleted = await this.roleService.removeUserRole(userId, role_schema_1.RoleName.SELLER);
        if (!isDeleted)
            return new error_response_1.BadRequestException('Xóa quyền thất bại!');
        return new success_response_1.SuccessResponse({
            message: 'Xóa cửa hàng thành công!',
            metadata: { data: result },
        });
    }
    async update(store, userId) {
        const newStore = await this.storeService.update(userId, store);
        if (!newStore)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật thông tin cửa hàng thành công!',
            metadata: { data: newStore },
        });
    }
    async updateWarningCount(id, action) {
        const store = await this.storeService.updateWarningCount(id, action);
        if (!store)
            throw new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật cảnh báo thành công!',
            metadata: { data: store },
        });
    }
};
exports.StoreController = StoreController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Post)('store/user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_store_dto_1.CreateStoreDto, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER, role_schema_1.RoleName.USER),
    (0, common_1.Get)('store/seller'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getMyStore", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiQuery)({ name: 'storeId', type: String, required: true }),
    (0, common_1.Get)('store-reputation'),
    __param(0, (0, common_1.Query)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getReputation", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, common_1.Get)('stores-most-products'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getListStoreHaveMostProducts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('store/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeleteStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Delete)('store/seller'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Put)('store/seller'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_store_dto_1.UpdateStoreDto, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Put)('store/manager/warningcount/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "updateWarningCount", null);
exports.StoreController = StoreController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('Store'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [store_service_1.StoreService,
        user_service_1.UserService,
        role_service_1.RoleService,
        feedback_service_1.FeedbackService,
        product_service_1.ProductService])
], StoreController);
//# sourceMappingURL=store.controller.js.map