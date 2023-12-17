/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion } from './schema/promotion.schema';
import { Model } from 'mongoose';
export declare class PromotionService {
    private readonly promotionModel;
    constructor(promotionModel: Model<Promotion>);
    create(createPromotionDto: CreatePromotionDto): Promise<Promotion>;
    findAllByProductType(productType: string): Promise<Promotion[]>;
    update(id: string, updatePromotionDto: CreatePromotionDto): Promise<Promotion>;
    remove(id: string): Promise<Promotion>;
}
