"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = void 0;
const common_1 = require("@nestjs/common");
const store_service_1 = require("./store.service");
const store_controller_1 = require("./store.controller");
const mongoose_1 = require("@nestjs/mongoose");
const store_schema_1 = require("./schema/store.schema");
const ability_module_1 = require("../ability/ability.module");
const role_module_1 = require("../role/role.module");
const user_module_1 = require("../user/user.module");
const feedback_module_1 = require("../feedback/feedback.module");
const product_module_1 = require("../product/product.module");
let StoreModule = class StoreModule {
};
exports.StoreModule = StoreModule;
exports.StoreModule = StoreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Store', schema: store_schema_1.StoreSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            (0, common_1.forwardRef)(() => product_module_1.ProductModule),
            feedback_module_1.FeedbackModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
        ],
        controllers: [store_controller_1.StoreController],
        providers: [store_service_1.StoreService],
        exports: [store_service_1.StoreService],
    })
], StoreModule);
//# sourceMappingURL=store.module.js.map