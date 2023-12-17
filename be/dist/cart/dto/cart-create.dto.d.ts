import { ProductBillDto } from "../../bill/dto/product-bill.dto";
export declare class CreateCartDto {
    userId: string;
    storeId: string;
    storeAvatar: string;
    storeName: string;
    listProducts: ProductBillDto[];
    totalPrice: number;
}
