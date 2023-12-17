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
exports.UserotpService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const userotp_schema_1 = require("./schema/userotp.schema");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
let UserotpService = class UserotpService {
    constructor(mailService, userotpModel) {
        this.mailService = mailService;
        this.userotpModel = userotpModel;
    }
    async sendotp(email) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await this.mailService.sendMail({
                to: email,
                from: process.env.MAIL_USER,
                subject: 'OTP',
                template: './otp',
                context: {
                    otp
                }
            });
            return otp;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async create(email, otp) {
        try {
            const userotp = await this.userotpModel.create({ email, otp });
            return userotp;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(email, otp) {
        try {
            const userotp = await this.userotpModel.updateOne({ email }, { otp });
            return userotp.modifiedCount > 0;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async findUserotpByEmail(email) {
        try {
            const userotp = await this.userotpModel.findOne({ email });
            return userotp;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async checkotp(otp, email) {
        try {
            const userotp = await this.userotpModel.findOne({ email });
            if (userotp.otp == otp) {
                return true;
            }
            return false;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async deleteotp(email) {
        try {
            return await this.userotpModel.findOneAndDelete({ email });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.UserotpService = UserotpService;
exports.UserotpService = UserotpService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(userotp_schema_1.Userotp.name)),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        mongoose_2.Model])
], UserotpService);
//# sourceMappingURL=userotp.service.js.map