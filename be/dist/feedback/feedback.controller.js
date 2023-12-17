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
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_1 = require("../core/error.response");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const get_current_userid_decorator_1 = require("../auth/decorators/get-current-userid.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const success_response_1 = require("../core/success.response");
const role_schema_1 = require("../role/schema/role.schema");
const user_service_1 = require("../user/user.service");
const create_feedback_dto_1 = require("./dto/create-feedback.dto");
const feedback_service_1 = require("./feedback.service");
let FeedbackController = class FeedbackController {
    constructor(feedbackService, userService) {
        this.feedbackService = feedbackService;
        this.userService = userService;
    }
    async create(productId, feedback, userId) {
        const newFeedback = await this.feedbackService.create(userId, productId, feedback);
        await this.userService.updateWallet(userId, 5000, 'plus');
        return new success_response_1.SuccessResponse({
            message: 'Đánh giá thành công!',
            metadata: { data: newFeedback },
        });
    }
    async getAllByProductIdPaging(page, limit, productId, userId) {
        const feedbacks = await this.feedbackService.getAllByProductIdPaging(page, limit, productId);
        const data = await Promise.all(feedbacks.feedbacks.map(async (feedback) => {
            const user = await this.userService.getById(feedback.userId);
            return {
                star: feedback.star,
                content: feedback.content,
                avatar: user.avatar,
                name: user.fullName,
                consensus: feedback.consensus,
                isConsensus: false,
                createdAt: feedback['createdAt'],
                userId: feedback.userId,
            };
        }));
        if (userId) {
            data.forEach((feedback) => {
                if (feedback.consensus.includes(userId)) {
                    feedback.isConsensus = true;
                }
            });
        }
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách đánh giá thành công!',
            metadata: { total: feedbacks.total, data },
        });
    }
    async getAllByProductIdStar(productId) {
        const feedbacks = await this.feedbackService.getAllByProductId(productId);
        const star = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        const startPercent = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (feedbacks.length === 0)
            return new success_response_1.SuccessResponse({
                message: 'Lấy danh sách đánh giá sao thành công!',
                metadata: { startPercent, averageStar: 0 },
            });
        feedbacks.forEach(feedback => {
            star[feedback.star]++;
        });
        Object.keys(star).forEach(key => {
            startPercent[key] = Math.round((star[key] / feedbacks.length) * 100);
        });
        let averageStar = 0;
        Object.keys(star).forEach(key => {
            averageStar += star[key] * Number(key);
        });
        averageStar = Number((averageStar / feedbacks.length).toFixed(2));
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách đánh giá sao thành công!',
            metadata: { startPercent, averageStar },
        });
    }
    async updateConsensus(userId, productId, userIdConsensus) {
        if (userId === userIdConsensus)
            return new error_response_1.BadRequestException('Bạn không thể đồng thuận với chính mình!');
        const result = await this.feedbackService.updateConsensus(userId, productId, userIdConsensus);
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy đánh giá này!');
        return new success_response_1.SuccessResponse({
            message: 'Đồng thuận thành công!',
            metadata: { data: { result } },
        });
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateFeedBackAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, common_1.Post)('feedback/user'),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_feedback_dto_1.CreateFeedbackDto, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('feedback'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('productId')),
    __param(3, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getAllByProductIdPaging", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('feedback-star'),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    __param(0, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getAllByProductIdStar", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateFeedBackAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, common_1.Put)('feedback-consensus'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('productId')),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "updateConsensus", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('FeedBack'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService,
        user_service_1.UserService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map