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
import { CreateProductDto } from './dto/create-product.dto';
import { ExcludeIds, FilterDate, FilterProduct } from './dto/product.dto';
import { Product } from './schema/product.schema';
export declare class ProductService {
    private readonly productModel;
    constructor(productModel: Model<Product>);
    create(storeId: string, product: CreateProductDto): Promise<Product>;
    getById(id: string): Promise<Product>;
    getAllBySearch(storeIdInput: string, pageQuery: number, limitQuery: number, searchQuery: string, sortTypeQuery: string, sortValueQuery: string, status: any): Promise<{
        total: number;
        products: Product[];
    }>;
    update(id: string, product: any): Promise<Product>;
    deleteProduct(productId: string): Promise<Product>;
    getListProductLasted(limit: number): Promise<Product[]>;
    updateQuantity(id: string, quantitySold: number): Promise<void>;
    getRandomProducts(limit: number, excludeIdsBody: ExcludeIds, cursor?: FilterDate): Promise<Product[]>;
    getAllBySearchAndFilter(pageQuery: number, limitQuery: number, searchQuery: string, filterQuery?: FilterProduct): Promise<{
        total: number;
        products: Product[];
    }>;
    private buildFilterQuery;
    getProductsByStoreId(storeId: string): Promise<Product[]>;
    deleteProductByCategory(categoryId: string): Promise<void>;
    getListStoreHaveMostProducts(limit?: number): Promise<any>;
}
