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
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const InternalServerErrorExceptionCustom_exception_1 = require("../exceptions/InternalServerErrorExceptionCustom.exception");
const feedback_schema_1 = require("./schema/feedback.schema");
let FeedbackService = class FeedbackService {
    constructor(feedbackModel) {
        this.feedbackModel = feedbackModel;
    }
    async create(userId, productId, feedback) {
        try {
            const newFeedback = await this.feedbackModel.create(feedback);
            newFeedback.userId = userId;
            newFeedback.productId = productId;
            await newFeedback.save();
            return newFeedback;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByProductIdPaging(page = 1, limit = 5, productId) {
        const skip = limit * (page - 1);
        try {
            const total = await this.feedbackModel.countDocuments({ productId });
            const feedbacks = await this.feedbackModel.find({ productId }).sort({ createdAt: -1 }).limit(limit).skip(skip);
            return { total, feedbacks };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError) {
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }
    async getAllByProductId(productId) {
        try {
            const feedbacks = await this.feedbackModel.find({ productId }).sort({ createdAt: -1 });
            return feedbacks;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError) {
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }
    async updateConsensus(userId, productId, userIdConsensus) {
        try {
            const feedback = await this.feedbackModel.findOne({ userId, productId });
            if (!feedback)
                return false;
            const index = feedback.consensus.findIndex(id => id.toString() === userIdConsensus.toString());
            index == -1 ? feedback.consensus.push(userIdConsensus) : feedback.consensus.splice(index, 1);
            await feedback.save();
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(feedback_schema_1.Feedback.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map