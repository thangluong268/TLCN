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
exports.EvaluationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const get_current_userid_decorator_1 = require("../auth/decorators/get-current-userid.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const bill_service_1 = require("../bill/bill.service");
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const notification_service_1 = require("../notification/notification.service");
const product_service_1 = require("../product/product.service");
const role_schema_1 = require("../role/schema/role.schema");
const store_service_1 = require("../store/store.service");
const user_service_1 = require("../user/user.service");
const body_dto_1 = require("./dto/body.dto");
const evaluation_service_1 = require("./evaluation.service");
let EvaluationController = class EvaluationController {
    constructor(evaluationService, notificationService, productService, userService, storeService, billService) {
        this.evaluationService = evaluationService;
        this.notificationService = notificationService;
        this.productService = productService;
        this.userService = userService;
        this.storeService = storeService;
        this.billService = billService;
    }
    async create(productId, evaluationDto, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const product = await this.productService.getById(productId);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const store = await this.storeService.getById(product.storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const hadEvaluation = await this.evaluationService.checkEvaluationByUserIdAndProductId(userId, productId);
        const result = await this.evaluationService.update(userId, productId, evaluationDto.name);
        console.log(result);
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        if (userId !== store.userId && !hadEvaluation) {
            const createNotiData = {
                userIdFrom: userId,
                userIdTo: store.userId,
                content: 'đã bày tỏ cảm xúc về sản phẩm của bạn!',
                type: evaluationDto.name,
                sub: {
                    fullName: user.fullName,
                    avatar: user.avatar,
                    productId: productId.toString(),
                },
            };
            await this.notificationService.create(createNotiData);
        }
        return new success_response_1.SuccessResponse({
            message: 'Đánh giá thành công!',
            metadata: { data: result },
        });
    }
    async getByProductId(productId, userId) {
        const evaluation = await this.evaluationService.getByProductId(productId);
        if (!evaluation)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const total = evaluation.emojis.length;
        const emoji = {
            Haha: 0,
            Love: 0,
            Wow: 0,
            Sad: 0,
            Angry: 0,
            like: 0,
        };
        evaluation.emojis.forEach(e => {
            switch (e.name) {
                case 'Haha':
                    emoji.Haha++;
                    break;
                case 'Love':
                    emoji.Love++;
                    break;
                case 'Wow':
                    emoji.Wow++;
                    break;
                case 'Sad':
                    emoji.Sad++;
                    break;
                case 'Angry':
                    emoji.Angry++;
                    break;
                case 'like':
                    emoji.like++;
                    break;
            }
        });
        let isReaction = false;
        let isPurchased = false;
        if (userId) {
            const evaluationOfUser = evaluation.emojis.find(emoji => emoji.userId.toString() === userId.toString());
            evaluationOfUser ? (isReaction = true) : (isReaction = false);
            isPurchased = await this.billService.checkUserPurchasedByProductId(userId, productId);
        }
        const data = {
            total,
            haha: emoji.Haha,
            love: emoji.Love,
            wow: emoji.Wow,
            sad: emoji.Sad,
            angry: emoji.Angry,
            like: emoji.like,
            isReaction,
            isPurchased,
        };
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách đánh giá thành công!',
            metadata: { data },
        });
    }
};
exports.EvaluationController = EvaluationController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateEvaluationAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, common_1.Put)('user'),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, body_dto_1.EvaluationDto, String]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: false }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getByProductId", null);
exports.EvaluationController = EvaluationController = __decorate([
    (0, common_1.Controller)('evaluation'),
    (0, swagger_1.ApiTags)('Evaluation'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [evaluation_service_1.EvaluationService,
        notification_service_1.NotificationService,
        product_service_1.ProductService,
        user_service_1.UserService,
        store_service_1.StoreService,
        bill_service_1.BillService])
], EvaluationController);
//# sourceMappingURL=evaluation.controller.js.map