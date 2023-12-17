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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const get_current_userid_decorator_1 = require("../auth/decorators/get-current-userid.decorator");
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const product_service_1 = require("../product/product.service");
const role_schema_1 = require("../role/schema/role.schema");
const store_service_1 = require("../store/store.service");
const cart_service_1 = require("./cart.service");
let CartController = class CartController {
    constructor(cartService, productService, storeService) {
        this.cartService = cartService;
        this.productService = productService;
        this.storeService = storeService;
    }
    async processCart(productId, userId) {
        const product = await this.productService.getById(productId);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const store = await this.storeService.getById(product.storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const result = await this.cartService.addProductIntoCart(userId, store, product);
        if (!result)
            return new error_response_1.InternalServerErrorException('Không thêm sản phẩm vào giỏ hàng được!');
        return new success_response_1.SuccessResponse({
            message: 'Thêm sản phẩm vào giỏ hàng thành công!',
            metadata: { data: result },
        });
    }
    async getByUserId(page, limit, search, userId) {
        const data = await this.cartService.getByUserId(userId, page, limit, search);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách giỏ hàng thành công!',
            metadata: { data },
        });
    }
    async getAllByUserId(userId) {
        const data = await this.cartService.getAllByUserId(userId);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách giỏ hàng thành công!',
            metadata: { data },
        });
    }
    async removeProductInCart(productId, userId) {
        const product = await this.productService.getById(productId);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const store = await this.storeService.getById(product.storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        await this.cartService.removeProductInCart(userId, productId, store._id);
        return new success_response_1.SuccessResponse({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công!',
            metadata: {},
        });
    }
    async getNewCartByUserId(userId) {
        const carts = await this.cartService.getAllByUserId(userId);
        const data = carts[0];
        return new success_response_1.SuccessResponse({
            message: 'Lấy giỏ hàng mới nhất thành công!',
            metadata: { data },
        });
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "processCart", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getByUserId", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('/get-all'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getAllByUserId", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeProductInCart", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('/get-new'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getNewCartByUserId", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart/user'),
    (0, swagger_1.ApiTags)('Cart'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [cart_service_1.CartService,
        product_service_1.ProductService,
        store_service_1.StoreService])
], CartController);
//# sourceMappingURL=cart.controller.js.map