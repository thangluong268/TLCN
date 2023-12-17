"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsertokenModule = void 0;
const common_1 = require("@nestjs/common");
const usertoken_service_1 = require("./usertoken.service");
const usertoken_controller_1 = require("./usertoken.controller");
const mongoose_1 = require("@nestjs/mongoose");
const usertoken_schema_1 = require("./schema/usertoken.schema");
let UsertokenModule = class UsertokenModule {
};
exports.UsertokenModule = UsertokenModule;
exports.UsertokenModule = UsertokenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'UserToken', schema: usertoken_schema_1.UserTokenSchema }]),
        ],
        controllers: [usertoken_controller_1.UsertokenController],
        providers: [usertoken_service_1.UsertokenService],
        exports: [usertoken_service_1.UsertokenService],
    })
], UsertokenModule);
//# sourceMappingURL=usertoken.module.js.map