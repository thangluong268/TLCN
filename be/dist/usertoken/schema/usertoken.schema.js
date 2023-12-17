"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenSchema = exports.UserToken = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
let UserToken = class UserToken extends mongoose_2.Document {
};
exports.UserToken = UserToken;
__decorate([
    (0, mongoose_1.Prop)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserToken.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserToken.prototype, "hashedRefreshToken", void 0);
exports.UserToken = UserToken = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], UserToken);
exports.UserTokenSchema = mongoose_1.SchemaFactory.createForClass(UserToken);
//# sourceMappingURL=usertoken.schema.js.map