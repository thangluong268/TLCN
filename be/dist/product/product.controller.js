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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const get_current_userid_decorator_1 = require("../auth/decorators/get-current-userid.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const bill_service_1 = require("../bill/bill.service");
const bill_schema_1 = require("../bill/schema/bill.schema");
const category_service_1 = require("../category/category.service");
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const evaluation_service_1 = require("../evaluation/evaluation.service");
const notification_service_1 = require("../notification/notification.service");
const role_schema_1 = require("../role/schema/role.schema");
const store_service_1 = require("../store/store.service");
const user_service_1 = require("../user/user.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const product_dto_1 = require("./dto/product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const product_service_1 = require("./product.service");
let ProductController = class ProductController {
    constructor(productService, storeService, evaluationService, userService, notificationService, billService, categoryService) {
        this.productService = productService;
        this.storeService = storeService;
        this.evaluationService = evaluationService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.billService = billService;
        this.categoryService = categoryService;
    }
    async create(product, userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const category = await this.categoryService.getById(product.categoryId);
        if (!category)
            return new error_response_1.NotFoundException('Không tìm thấy danh mục này!');
        const newProduct = await this.productService.create(store._id, product);
        await this.evaluationService.create(newProduct._id);
        const userHasFollowStores = await this.userService.getFollowStoresByStoreId(store._id);
        const notificationPromises = [];
        for (const user of userHasFollowStores) {
            if (userId === user._id)
                continue;
            const notificationPromise = this.notificationService.create({
                userIdFrom: userId,
                userIdTo: user._id,
                content: `đã đăng sản phẩm mới. ${newProduct.productName}`,
                type: 'Thêm sản phẩm',
                sub: {
                    fullName: store.name,
                    avatar: store.avatar,
                    productId: newProduct._id.toString(),
                },
            });
            notificationPromises.push(notificationPromise);
        }
        await Promise.all(notificationPromises);
        return new success_response_1.SuccessResponse({
            message: 'Tạo sản phẩm thành công!',
            metadata: { data: newProduct },
        });
    }
    async sellerCreateMultiple(products, userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        products.forEach(async (product) => {
            const newProduct = await this.productService.create(store._id, product);
            await this.evaluationService.create(newProduct._id);
        });
    }
    async getAllBySearch(page, limit, search, sortType, sortValue, userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const products = await this.productService.getAllBySearch(store._id, page, limit, search, sortType, sortValue, {});
        const fullInfoProducts = await Promise.all(products.products.map(async (product) => {
            const category = await this.categoryService.getById(product.categoryId);
            const quantitySold = await this.billService.countProductDelivered(product._id, bill_schema_1.PRODUCT_TYPE.SELL, 'DELIVERED');
            const quantityGive = await this.billService.countProductDelivered(product._id, bill_schema_1.PRODUCT_TYPE.GIVE, 'DELIVERED');
            const revenue = quantitySold * product.price;
            const isPurchased = await this.billService.checkProductPurchased(product._id);
            return {
                ...product.toObject(),
                categoryName: category.name,
                storeName: store.name,
                quantitySold,
                quantityGive,
                revenue,
                isPurchased,
            };
        }));
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data: { total: products.total, products: fullInfoProducts } },
        });
    }
    async getAllBySearchPublic(page, limit, search) {
        const products = await this.productService.getAllBySearch(null, page, limit, search, null, null, { status: true });
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data: products },
        });
    }
    async getAllOtherProductByStoreId(storeId, productId) {
        const products = await this.productService.getProductsByStoreId(storeId);
        const relateProducts = products.filter(product => product._id.toString() !== productId).slice(0, 12);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách tất cả sản phẩm khác cùng cửa hàng thành công!',
            metadata: { total: relateProducts.length, data: relateProducts },
        });
    }
    async update(id, product) {
        const newProduct = await this.productService.update(id, product);
        if (!newProduct)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật sản phẩm thành công!',
            metadata: { data: newProduct },
        });
    }
    async getlistProductLasted(limit) {
        const data = await this.productService.getListProductLasted(Number(limit));
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data },
        });
    }
    async mostProductsInStore(limit) {
        const storeHaveMostProducts = await this.productService.getListStoreHaveMostProducts(Number(limit));
        const data = await Promise.all(storeHaveMostProducts.map(async (item) => {
            const store = await this.storeService.getById(item._id);
            if (!store)
                throw new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
            let products = await this.productService.getProductsByStoreId(item._id.toString());
            products = products.map(product => {
                product = product.toObject();
                delete product.storeId;
                delete product.status;
                delete product['createdAt'];
                delete product['updatedAt'];
                delete product.__v;
                return product;
            });
            return {
                storeId: store._id,
                storeName: store.name,
                storeAvatar: store.avatar,
                listProducts: products.slice(0, 10),
            };
        }));
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data },
        });
    }
    async getRandom(excludeIds, limit, cursor) {
        const products = await this.productService.getRandomProducts(limit, excludeIds, cursor);
        if (!products)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm!');
        const nextCursor = products.length > 0 ? products[products.length - 1]['createdAt'] : null;
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin sản phẩm thành công!',
            metadata: { nextCursor, data: products },
        });
    }
    async getAllBySearchAndFilterPublic(page, limit, search, filter) {
        const category = await this.categoryService.getById(search.toString());
        const products = await this.productService.getAllBySearchAndFilter(page, limit, search, filter);
        const data = {
            total: products.total,
            products: products.products,
            categoryName: category.name,
        };
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data },
        });
    }
    async getById(id) {
        const product = await this.productService.getById(id);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const type = product.price === 0 ? bill_schema_1.PRODUCT_TYPE.GIVE : bill_schema_1.PRODUCT_TYPE.SELL;
        const quantityDelivered = await this.billService.countProductDelivered(id, type, 'DELIVERED');
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin sản phẩm thành công!',
            metadata: { data: product, quantityDelivered },
        });
    }
    async deleteProduct(id) {
        const product = await this.productService.deleteProduct(id);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        return new success_response_1.SuccessResponse({
            message: 'Xóa sản phẩm thành công!',
            metadata: { data: product },
        });
    }
    async deleteCategory(categoryId) {
        const product = await this.productService.deleteProductByCategory(categoryId);
        return new success_response_1.SuccessResponse({
            message: 'Xóa sản phẩm thành công!',
            metadata: { data: product },
        });
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Post)('product/seller'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Post)('product/sellerCreateMultiple'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "sellerCreateMultiple", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Get)('product/seller'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sortType', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sortValue', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sortType')),
    __param(4, (0, common_1.Query)('sortValue')),
    __param(5, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllBySearch", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllBySearchPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('products-other-in-store'),
    (0, swagger_1.ApiQuery)({ name: 'storeId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    __param(0, (0, common_1.Query)('storeId')),
    __param(1, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllOtherProductByStoreId", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Patch)('product/seller/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product/listProductLasted'),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getlistProductLasted", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product/mostProductsInStore'),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "mostProductsInStore", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, common_1.Post)('product/random'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.ExcludeIds, Number, product_dto_1.FilterDate]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getRandom", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product-filter'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, product_dto_1.FilterProduct]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllBySearchAndFilterPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeleteProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER, role_schema_1.RoleName.SELLER),
    (0, common_1.Delete)('product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', type: String, required: false }),
    (0, common_1.Delete)('product'),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteCategory", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('Product'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        store_service_1.StoreService,
        evaluation_service_1.EvaluationService,
        user_service_1.UserService,
        notification_service_1.NotificationService,
        bill_service_1.BillService,
        category_service_1.CategoryService])
], ProductController);
//# sourceMappingURL=product.controller.js.map