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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsertokenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const usertoken_schema_1 = require("./schema/usertoken.schema");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
let UsertokenService = class UsertokenService {
    constructor(userTokenModel) {
        this.userTokenModel = userTokenModel;
    }
    async hashData(data) {
        const saltOrRounds = Number(process.env.SALT_ROUNDS);
        return await bcrypt.hash(data, saltOrRounds);
    }
    async createUserToken(userId, refreshToken) {
        const hashedRT = await this.hashData(refreshToken);
        try {
            const userToken = await this.userTokenModel.create({
                userId,
                hashedRefreshToken: hashedRT,
            });
            return userToken;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateUserToken(userId, refreshToken) {
        try {
            const hashedRT = await this.hashData(refreshToken);
            const userToken = await this.userTokenModel.findOneAndUpdate({ userId }, { hashedRefreshToken: hashedRT }, { new: true });
            if (!userToken) {
                return false;
            }
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async deleteUserToken(userId) {
        try {
            const userToken = await this.userTokenModel.findOneAndDelete({ userId });
            if (!userToken) {
                return false;
            }
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getUserTokenById(userId) {
        try {
            const userToken = await this.userTokenModel.findOne({ userId });
            return userToken;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.UsertokenService = UsertokenService;
exports.UsertokenService = UsertokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usertoken_schema_1.UserToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsertokenService);
//# sourceMappingURL=usertoken.service.js.map