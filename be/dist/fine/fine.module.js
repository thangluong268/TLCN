"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FineModule = void 0;
const common_1 = require("@nestjs/common");
const fine_service_1 = require("./fine.service");
const fine_controller_1 = require("./fine.controller");
const mongoose_1 = require("@nestjs/mongoose");
const ability_module_1 = require("../ability/ability.module");
const role_module_1 = require("../role/role.module");
const fine_shema_1 = require("./schema/fine.shema");
let FineModule = class FineModule {
};
exports.FineModule = FineModule;
exports.FineModule = FineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Fine', schema: fine_shema_1.FineSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
        ],
        controllers: [fine_controller_1.FineController],
        providers: [fine_service_1.FineService],
    })
], FineModule);
//# sourceMappingURL=fine.module.js.map