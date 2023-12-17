"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const user_module_1 = require("../user/user.module");
const role_module_1 = require("../role/role.module");
const jwt_at_strategy_1 = require("./strategies/jwt-at.strategy");
const jwt_rt_strategy_1 = require("./strategies/jwt-rt.strategy");
const ability_module_1 = require("../ability/ability.module");
const core_1 = require("@nestjs/core");
const jwt_at_auth_guard_1 = require("./guards/jwt-at-auth.guard");
const usertoken_module_1 = require("../usertoken/usertoken.module");
const firebase_module_1 = require("../firebase/firebase.module");
const store_module_1 = require("../store/store.module");
const product_module_1 = require("../product/product.module");
const evaluation_module_1 = require("../evaluation/evaluation.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            user_module_1.UserModule,
            passport_1.PassportModule,
            role_module_1.RoleModule,
            ability_module_1.AbilityModule,
            usertoken_module_1.UsertokenModule,
            firebase_module_1.FirebaseModule,
            store_module_1.StoreModule,
            product_module_1.ProductModule,
            evaluation_module_1.EvaluationModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_at_strategy_1.JwtATStrategy,
            jwt_rt_strategy_1.JwtRTStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_at_auth_guard_1.JwtATAuthGuard,
            },
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map