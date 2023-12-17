"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedsModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_command_1 = require("nestjs-command");
const data_seed_1 = require("./data.seed");
const user_module_1 = require("../user/user.module");
const role_module_1 = require("../role/role.module");
let SeedsModule = class SeedsModule {
};
exports.SeedsModule = SeedsModule;
exports.SeedsModule = SeedsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_command_1.CommandModule,
            user_module_1.UserModule,
            role_module_1.RoleModule,
        ],
        providers: [data_seed_1.DataSeed],
        exports: [data_seed_1.DataSeed],
    })
], SeedsModule);
//# sourceMappingURL=seeds.module.js.map