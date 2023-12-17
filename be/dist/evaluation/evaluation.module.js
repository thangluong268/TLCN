"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationModule = void 0;
const common_1 = require("@nestjs/common");
const evaluation_service_1 = require("./evaluation.service");
const evaluation_controller_1 = require("./evaluation.controller");
const mongoose_1 = require("@nestjs/mongoose");
const ability_module_1 = require("../ability/ability.module");
const role_module_1 = require("../role/role.module");
const evaluation_schema_1 = require("./schema/evaluation.schema");
const notification_module_1 = require("../notification/notification.module");
const product_module_1 = require("../product/product.module");
const user_module_1 = require("../user/user.module");
const store_module_1 = require("../store/store.module");
const bill_module_1 = require("../bill/bill.module");
let EvaluationModule = class EvaluationModule {
};
exports.EvaluationModule = EvaluationModule;
exports.EvaluationModule = EvaluationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Evaluation', schema: evaluation_schema_1.EvaluationSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            notification_module_1.NotificationModule,
            (0, common_1.forwardRef)(() => store_module_1.StoreModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => product_module_1.ProductModule),
            (0, common_1.forwardRef)(() => bill_module_1.BillModule),
        ],
        controllers: [evaluation_controller_1.EvaluationController],
        providers: [evaluation_service_1.EvaluationService],
        exports: [evaluation_service_1.EvaluationService]
    })
], EvaluationModule);
//# sourceMappingURL=evaluation.module.js.map