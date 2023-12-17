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
import { Document } from 'mongoose';
import { GiveInfo, ProductInfo, ReceiverInfo } from '../dto/create-bill.dto';
export declare const BILL_STATUS = "NEW-CONFIRMED-DELIVERING-DELIVERED-CANCELLED-RETURNED";
export declare const BILL_STATUS_TRANSITION: {
    NEW: string;
    CONFIRMED: string;
    DELIVERING: string;
    DELIVERED: string;
    CANCELLED: string;
    RETURNED: string;
};
export declare enum PRODUCT_TYPE {
    SELL = "SELL",
    GIVE = "GIVE"
}
export declare class Bill extends Document {
    userId: string;
    storeId: string;
    listProducts: ProductInfo[];
    notes: string;
    totalPrice: number;
    deliveryMethod: string;
    paymentMethod: string;
    receiverInfo: ReceiverInfo;
    giveInfo: GiveInfo | null;
    deliveryFee: number;
    status: string;
    isPaid: boolean;
}
export declare const BillSchema: import("mongoose").Schema<Bill, import("mongoose").Model<Bill, any, any, any, Document<unknown, any, Bill> & Bill & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bill, Document<unknown, {}, Bill> & Bill & {
    _id: import("mongoose").Types.ObjectId;
}>;
