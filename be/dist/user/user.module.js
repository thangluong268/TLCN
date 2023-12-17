"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const ability_module_1 = require("../ability/ability.module");
const bill_module_1 = require("../bill/bill.module");
const role_module_1 = require("../role/role.module");
const HasPermitRole_middleware_1 = require("../user/middleware/HasPermitRole.middleware");
const HasSameRoleUser_middleware_1 = require("./middleware/HasSameRoleUser.middleware");
const user_schema_1 = require("./schema/user.schema");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const store_module_1 = require("../store/store.module");
let UserModule = class UserModule {
    configure(consumer) {
        consumer
            .apply(HasPermitRole_middleware_1.HasPermitRoleMiddleware)
            .forRoutes({ path: 'user/user/:id', method: common_1.RequestMethod.GET }, { path: 'user/user/:id', method: common_1.RequestMethod.PUT }, { path: 'user/user/:id', method: common_1.RequestMethod.DELETE });
        consumer
            .apply(HasSameRoleUser_middleware_1.HasSameRoleUserMiddleware)
            .forRoutes({ path: 'user/user/addFriend/:id', method: common_1.RequestMethod.POST }, { path: 'user/user/unFriend/:id', method: common_1.RequestMethod.POST });
    }
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: user_schema_1.UserSchema }]), ability_module_1.AbilityModule, role_module_1.RoleModule, bill_module_1.BillModule, store_module_1.StoreModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map