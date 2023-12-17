"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const product_controller_1 = require("./product.controller");
const mongoose_1 = require("@nestjs/mongoose");
const ability_module_1 = require("../ability/ability.module");
const role_module_1 = require("../role/role.module");
const product_schema_1 = require("./schema/product.schema");
const store_module_1 = require("../store/store.module");
const evaluation_module_1 = require("../evaluation/evaluation.module");
const user_module_1 = require("../user/user.module");
const notification_module_1 = require("../notification/notification.module");
const bill_module_1 = require("../bill/bill.module");
const category_module_1 = require("../category/category.module");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Product', schema: product_schema_1.ProductSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            notification_module_1.NotificationModule,
            category_module_1.CategoryModule,
            (0, common_1.forwardRef)(() => bill_module_1.BillModule),
            evaluation_module_1.EvaluationModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => store_module_1.StoreModule),
        ],
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService],
        exports: [product_service_1.ProductService]
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map