"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserotpModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const userotp_schema_1 = require("./schema/userotp.schema");
const ability_module_1 = require("../ability/ability.module");
const role_module_1 = require("../role/role.module");
const userotp_service_1 = require("./userotp.service");
const userotp_controller_1 = require("./userotp.controller");
const user_module_1 = require("../user/user.module");
const firebase_module_1 = require("../firebase/firebase.module");
let UserotpModule = class UserotpModule {
};
exports.UserotpModule = UserotpModule;
exports.UserotpModule = UserotpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Userotp', schema: userotp_schema_1.UserotpSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            user_module_1.UserModule,
            firebase_module_1.FirebaseModule
        ],
        controllers: [userotp_controller_1.UserotpController],
        providers: [userotp_service_1.UserotpService],
        exports: [userotp_service_1.UserotpService],
    })
], UserotpModule);
//# sourceMappingURL=userotp.module.js.map