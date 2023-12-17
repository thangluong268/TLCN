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
exports.BillController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const get_current_userid_decorator_1 = require("../auth/decorators/get-current-userid.decorator");
const cart_service_1 = require("../cart/cart.service");
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const product_service_1 = require("../product/product.service");
const role_schema_1 = require("../role/schema/role.schema");
const store_service_1 = require("../store/store.service");
const user_service_1 = require("../user/user.service");
const bill_service_1 = require("./bill.service");
const create_bill_dto_1 = require("./dto/create-bill.dto");
const payment_gateway_1 = require("./payment/payment.gateway");
const payment_service_1 = require("./payment/payment.service");
const bill_schema_1 = require("./schema/bill.schema");
let BillController = class BillController {
    constructor(billService, paymentService, userService, productService, storeService, cartService) {
        this.billService = billService;
        this.paymentService = paymentService;
        this.userService = userService;
        this.productService = productService;
        this.storeService = storeService;
        this.cartService = cartService;
        this.paymentService.registerPaymentGateway(payment_gateway_1.PAYMENT_METHOD.VNPAY, new payment_gateway_1.VNPayGateway());
        this.paymentService.registerPaymentGateway(payment_gateway_1.PAYMENT_METHOD.MOMO, new payment_gateway_1.MoMoGateway());
        this.paymentService.registerPaymentGateway(payment_gateway_1.PAYMENT_METHOD.GIVE, new payment_gateway_1.GiveGateway());
    }
    async create(createBillDto, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const newBills = await Promise.all(createBillDto.data.map(async (billDto) => {
            await this.userService.updateWallet(userId, billDto.totalPrice, 'plus');
            await this.cartService.removeMultiProductInCart(userId, billDto.listProducts, billDto.storeId);
            billDto.listProducts.forEach(async (product) => {
                await this.productService.updateQuantity(product.productId, product.quantity);
            });
            const newBill = await this.billService.create(userId, billDto, createBillDto.deliveryMethod, createBillDto.paymentMethod, createBillDto.receiverInfo, createBillDto.giveInfo, createBillDto.deliveryFee);
            return newBill;
        }));
        return new success_response_1.SuccessResponse({
            message: 'Đặt hàng thành công!',
            metadata: { data: newBills },
        });
    }
    async countTotalByStatusSeller(year, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const statusData = bill_schema_1.BILL_STATUS.split('-').map((item) => item.toUpperCase());
        const countTotal = await Promise.all(statusData.map(async (status) => {
            return this.billService.countTotalByStatusSeller(store._id, status, year);
        }));
        const transformedData = Object.fromEntries(countTotal.map((value, index) => [statusData[index], value]));
        return new success_response_1.SuccessResponse({
            message: 'Lấy tổng số lượng các đơn theo trạng thái thành công!',
            metadata: { data: transformedData },
        });
    }
    async countTotalByStatusUser(userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const statusData = bill_schema_1.BILL_STATUS.split('-').map((item) => item.toUpperCase());
        const countTotal = await Promise.all(statusData.map(async (status) => {
            return this.billService.countTotalByStatusUser(userId, status);
        }));
        const transformedData = countTotal.map((value, index) => {
            return {
                status: statusData[index],
                title: bill_schema_1.BILL_STATUS_TRANSITION[statusData[index]],
                value: value,
            };
        });
        return new success_response_1.SuccessResponse({
            message: 'Lấy tổng số lượng các đơn theo trạng thái thành công!',
            metadata: { data: transformedData },
        });
    }
    async calculateRevenueByYear(year, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const data = await this.billService.calculateRevenueByYear(store._id, year);
        return new success_response_1.SuccessResponse({
            message: 'Lấy doanh thu của từng tháng theo năm thành công!',
            metadata: { data },
        });
    }
    async countCharityByYear(year, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const data = await this.billService.countCharityByYear(store._id, year);
        return new success_response_1.SuccessResponse({
            message: 'Lấy kết quả từ thiện của từng tháng theo năm thành công!',
            metadata: { data },
        });
    }
    async getAllByStatusUser(page, limit, status, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const data = await this.billService.getAllByStatus({ userId }, page, limit, status);
        const fullData = await Promise.all(data.bills.map(async (bill) => {
            const listProductsFullInfo = await Promise.all(bill.listProducts.map(async (product) => {
                const productFullInfo = await this.productService.getById(product.productId);
                const productData = {
                    product: productFullInfo,
                    subInfo: product,
                };
                delete productData.subInfo.productId;
                delete productData.subInfo.type;
                return productData;
            }));
            const storeInfo = await this.storeService.getById(bill.storeId);
            let userInfo = await this.userService.getById(bill.userId);
            userInfo = userInfo.toObject();
            delete userInfo.password;
            return {
                _id: bill._id,
                storeInfo,
                listProductsFullInfo,
                userInfo,
                notes: bill.notes,
                totalPrice: bill.totalPrice,
                deliveryMethod: bill.deliveryMethod,
                paymentMethod: bill.paymentMethod,
                receiverInfo: bill.receiverInfo,
                giveInfo: bill.giveInfo,
                deliveryFee: bill.deliveryFee,
                status: bill.status,
                isPaid: bill.isPaid,
                createdAt: bill.createdAt,
            };
        }));
        return new success_response_1.SuccessResponse({
            message: `Lấy danh sách đơn hàng ${role_schema_1.RoleName.USER} thành công!`,
            metadata: { data: { total: data.total, fullData } },
        });
    }
    async getAllByStatusSeller(page, limit, status, userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const data = await this.billService.getAllByStatus({ storeId: store._id }, page, limit, status);
        const fullData = await Promise.all(data.bills.map(async (bill) => {
            const listProductsFullInfo = await Promise.all(bill.listProducts.map(async (product) => {
                const productFullInfo = await this.productService.getById(product.productId);
                const productData = {
                    product: productFullInfo,
                    subInfo: product,
                };
                delete productData.subInfo.productId;
                delete productData.subInfo.type;
                return productData;
            }));
            const storeInfo = await this.storeService.getById(bill.storeId);
            let userInfo = await this.userService.getById(bill.userId);
            userInfo = userInfo.toObject();
            delete userInfo.password;
            return {
                _id: bill._id,
                storeInfo,
                listProductsFullInfo,
                userInfo,
                notes: bill.notes,
                totalPrice: bill.totalPrice,
                deliveryMethod: bill.deliveryMethod,
                paymentMethod: bill.paymentMethod,
                receiverInfo: bill.receiverInfo,
                giveInfo: bill.giveInfo,
                deliveryFee: bill.deliveryFee,
                status: bill.status,
                isPaid: bill.isPaid,
                createdAt: bill.createdAt,
            };
        }));
        return new success_response_1.SuccessResponse({
            message: `Lấy danh sách đơn hàng ${role_schema_1.RoleName.SELLER} thành công!`,
            metadata: { data: { total: data.total, fullData } },
        });
    }
    async getMyBill(id, userId) {
        const bill = await this.billService.getMyBill(id, userId);
        if (!bill)
            return new error_response_1.NotFoundException('Không tìm thấy đơn hàng này!');
        const listProductsFullInfo = await Promise.all(bill.listProducts.map(async (product) => {
            const productFullInfo = await this.productService.getById(product.productId);
            const productData = {
                product: productFullInfo,
                subInfo: product,
            };
            delete productData.subInfo.productId;
            delete productData.subInfo.type;
            return productData;
        }));
        const storeInfo = await this.storeService.getById(bill.storeId);
        let userInfo = await this.userService.getById(bill.userId);
        userInfo = userInfo.toObject();
        delete userInfo.password;
        const fullData = {
            _id: bill._id,
            storeInfo,
            listProductsFullInfo,
            userInfo,
            notes: bill.notes,
            totalPrice: bill.totalPrice,
            deliveryMethod: bill.deliveryMethod,
            paymentMethod: bill.paymentMethod,
            receiverInfo: bill.receiverInfo,
            giveInfo: bill.giveInfo,
            deliveryFee: bill.deliveryFee,
            status: bill.status,
            isPaid: bill.isPaid,
            createdAt: bill.createdAt,
        };
        return new success_response_1.SuccessResponse({
            message: `Lấy đơn hàng thành công!`,
            metadata: { data: fullData },
        });
    }
    async cancelBill(id, userId) {
        const bill = await this.billService.getById(id);
        const result = await this.billService.update(id, 'CANCELLED');
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy đơn hàng này!');
        await this.userService.updateWallet(userId, bill.totalPrice, 'sub');
        return new success_response_1.SuccessResponse({
            message: 'Hủy đơn hàng thành công!',
            metadata: { data: result },
        });
    }
    async updateStatus(id, status) {
        const bill = await this.billService.getById(id);
        if (!bill)
            return new error_response_1.NotFoundException('Không tìm thấy đơn hàng này!');
        const result = await this.billService.update(id, status);
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy đơn hàng này!');
        if (status === 'CANCELLED')
            await this.userService.updateWallet(bill.userId, bill.totalPrice, 'sub');
        if (status === 'RETURNED') {
            await this.userService.updateWallet(bill.userId, bill.totalPrice, 'sub');
            await this.userService.updateWallet(bill.userId, bill.totalPrice * 5, 'plus');
        }
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật trạng thái đơn hàng thành công!',
            metadata: { data: result },
        });
    }
};
exports.BillController = BillController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Post)('user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bill_dto_1.CreateBillDto, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, swagger_1.ApiQuery)({ name: 'year', type: Number, required: false, example: '2023' }),
    (0, common_1.Get)('seller/count-total-by-status'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "countTotalByStatusSeller", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('user/count-total-by-status'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "countTotalByStatusUser", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, swagger_1.ApiQuery)({ name: 'year', type: Number, required: true, example: '2023' }),
    (0, common_1.Get)('seller/calculate-revenue-by-year'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "calculateRevenueByYear", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, swagger_1.ApiQuery)({ name: 'year', type: Number, required: true, example: '2023' }),
    (0, common_1.Get)('seller/count-charity-by-year'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "countCharityByYear", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('user'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: true, example: 'NEW' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "getAllByStatusUser", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Get)('seller'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: true, example: 'NEW' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "getAllByStatusSeller", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "getMyBill", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Put)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "cancelBill", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Put)('/seller/:id'),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "updateStatus", null);
exports.BillController = BillController = __decorate([
    (0, common_1.Controller)('bill'),
    (0, swagger_1.ApiTags)('Bill'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [bill_service_1.BillService,
        payment_service_1.PaymentService,
        user_service_1.UserService,
        product_service_1.ProductService,
        store_service_1.StoreService,
        cart_service_1.CartService])
], BillController);
//# sourceMappingURL=bill.controller.js.map