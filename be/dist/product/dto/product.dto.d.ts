export declare class ProductDto {
    _id: string;
    avatar: string[];
    quantity: number;
    productName: string;
    price: number;
    description: string;
    categoryId: string;
    categoryName: string;
    keywords: string[];
    storeId: string;
    storeName: string;
    quantitySold: number;
    quantityGive: number;
    revenue: number;
}
export declare class ExcludeIds {
    ids: string[];
}
export declare class FilterProduct {
    priceMin?: number;
    priceMax?: number;
    quantityMin?: number;
    quantityMax?: number;
    createdAtMin?: Date;
    createdAtMax?: Date;
}
export declare class FilterDate {
    date?: Date;
}
