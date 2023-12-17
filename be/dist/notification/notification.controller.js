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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const role_schema_1 = require("../role/schema/role.schema");
const get_current_userid_decorator_1 = require("../auth/decorators/get-current-userid.decorator");
const user_service_1 = require("../user/user.service");
const update_notification_dto_1 = require("./dto/update-notification.dto");
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
let NotificationController = class NotificationController {
    constructor(notificationService, userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }
    async create(notification) {
        const newNotification = await this.notificationService.create(notification);
        return new success_response_1.SuccessResponse({
            message: "Tạo thông báo thành công!",
            metadata: { data: newNotification },
        });
    }
    async getAllByUserId(page, limit, userId) {
        const data = await this.notificationService.getAllByUserId(userId, page, limit);
        return new success_response_1.SuccessResponse({
            message: "Lấy danh sách thông báo thành công!",
            metadata: { data },
        });
    }
    async update(id, updateNoti) {
        const result = await this.notificationService.update(id, updateNoti);
        if (!result)
            return new error_response_1.NotFoundException("Không tìm thấy thông báo này!");
        return new success_response_1.SuccessResponse({
            message: "Cập nhật thông báo thành công!",
            metadata: { data: result },
        });
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadNotificationAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER, role_schema_1.RoleName.USER),
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getAllByUserId", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateNotificationAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER, role_schema_1.RoleName.USER),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "update", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notification'),
    (0, swagger_1.ApiTags)('Notification'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        user_service_1.UserService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map