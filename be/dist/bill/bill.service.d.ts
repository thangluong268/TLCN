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
import { Model } from 'mongoose';
import { CartInfo, GiveInfo, ReceiverInfo } from './dto/create-bill.dto';
import { ProductBillDto } from './dto/product-bill.dto';
import { Bill } from './schema/bill.schema';
export declare class BillService {
    private readonly billModel;
    constructor(billModel: Model<Bill>);
    getTotalPriceWithPromotion(listProducts: ProductBillDto[], promotionValue: number): number;
    create(userId: string, billDto: CartInfo, deliveryMethod: string, paymentMethod: string, receiverInfo: ReceiverInfo, giveInfo: GiveInfo, deliveryFee: number): Promise<Bill>;
    countTotalByStatusSeller(storeId: string, status: string, year: number): Promise<number>;
    countTotalByStatusUser(userId: string, status: string): Promise<number>;
    calculateRevenueAllTime(storeId: string): Promise<number>;
    calculateRevenueByYear(storeId: string, year: number): Promise<Record<string, any>>;
    countCharityAllTime(storeId: string): Promise<number>;
    countCharityByYear(storeId: string, year: number): Promise<Record<string, any>>;
    getAllByStatus(idCondition: any, pageQuery: number, limitQuery: number, statusQuery: string): Promise<{
        total: number;
        bills: Bill[];
    }>;
    getById(id: string): Promise<Bill>;
    getMyBill(id: string, userId: string): Promise<Bill>;
    update(id: string, status: string): Promise<boolean>;
    countProductDelivered(productId: string, type: string, status: string): Promise<number>;
    checkProductPurchased(productId: string): Promise<boolean>;
    getAllByUserId(userId: string): Promise<Bill[]>;
    checkUserPurchasedByProductId(userId: string, productId: string): Promise<boolean>;
}
