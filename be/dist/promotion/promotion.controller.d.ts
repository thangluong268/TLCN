import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { SuccessResponse } from '../core/success.response';
import { NotFoundException } from '../core/error.response';
export declare class PromotionController {
    private readonly promotionService;
    constructor(promotionService: PromotionService);
    create(createPromotionDto: CreatePromotionDto): Promise<SuccessResponse>;
    findAllByProductType(productType: string): Promise<SuccessResponse>;
    update(id: string, updatePromotionDto: CreatePromotionDto): Promise<SuccessResponse | NotFoundException>;
    remove(id: string): Promise<SuccessResponse | NotFoundException>;
}
