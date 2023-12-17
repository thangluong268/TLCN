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
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './schema/store.schema';
import { UpdateStoreDto } from './dto/update-store.dto';
export declare class StoreService {
    private readonly storeModel;
    constructor(storeModel: Model<Store>);
    create(userId: string, store: CreateStoreDto): Promise<Store | boolean>;
    getById(id: string): Promise<Store>;
    getByUserId(userId: string): Promise<Store>;
    update(userId: string, store: UpdateStoreDto): Promise<Store>;
    updateWarningCount(storeId: string, action: string): Promise<Store>;
    delete(userId: string): Promise<Store>;
}
