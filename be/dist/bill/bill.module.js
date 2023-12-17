"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const ability_module_1 = require("../ability/ability.module");
const cart_module_1 = require("../cart/cart.module");
const product_module_1 = require("../product/product.module");
const role_module_1 = require("../role/role.module");
const store_module_1 = require("../store/store.module");
const user_module_1 = require("../user/user.module");
const bill_controller_1 = require("./bill.controller");
const bill_service_1 = require("./bill.service");
const payment_module_1 = require("./payment/payment.module");
const bill_schema_1 = require("./schema/bill.schema");
let BillModule = class BillModule {
};
exports.BillModule = BillModule;
exports.BillModule = BillModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Bill', schema: bill_schema_1.BillSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            payment_module_1.PaymentModule,
            cart_module_1.CartModule,
            product_module_1.ProductModule,
            store_module_1.StoreModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
        ],
        controllers: [bill_controller_1.BillController],
        providers: [bill_service_1.BillService],
        exports: [bill_service_1.BillService],
    })
], BillModule);
//# sourceMappingURL=bill.module.js.map