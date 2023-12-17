export declare class SeedUserDto {
    avatar: string;
    fullName: string;
    email: string;
    password: string;
    phone: string;
}
export declare class SeedStoreDto {
    avatar: string;
    name: string;
    description: string;
    address: string;
    phoneNumber: string[];
}
export declare class SeedProductDto {
    avatar: string[];
    quantity: number;
    productName: string;
    price: number;
    description: string;
    categoryId: string;
    keywords: string[];
    storeId: string;
}
export declare class SeedDto {
    users: SeedUserDto[];
    stores: SeedStoreDto[];
}
