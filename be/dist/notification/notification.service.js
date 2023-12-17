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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notification_schema_1 = require("./schema/notification.schema");
const mongoose_2 = require("mongoose");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
let NotificationService = class NotificationService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    async create(notification) {
        try {
            const newNotification = await this.notificationModel.create(notification);
            return newNotification;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByUserId(userId, pageQuery, limitQuery) {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const skip = limit * (page - 1);
        try {
            const total = await this.notificationModel.countDocuments({ userIdTo: userId });
            const notifications = await this.notificationModel.find({ userIdTo: userId })
                .sort({ updatedAt: -1 })
                .limit(limit)
                .skip(skip);
            return { total, notifications };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, updateNoti) {
        try {
            const notification = await this.notificationModel.findByIdAndUpdate(id, updateNoti);
            if (!notification) {
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
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
//# sourceMappingURL=notification.service.js.map