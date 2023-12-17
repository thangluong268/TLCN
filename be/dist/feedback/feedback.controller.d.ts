import { BadRequestException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { UserService } from '../user/user.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private readonly feedbackService;
    private readonly userService;
    constructor(feedbackService: FeedbackService, userService: UserService);
    create(productId: string, feedback: CreateFeedbackDto, userId: string): Promise<SuccessResponse>;
    getAllByProductIdPaging(page: number, limit: number, productId: string, userId: string): Promise<SuccessResponse>;
    getAllByProductIdStar(productId: string): Promise<SuccessResponse>;
    updateConsensus(userId: string, productId: string, userIdConsensus: string): Promise<SuccessResponse | NotFoundException | BadRequestException>;
}
