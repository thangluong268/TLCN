import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import { ProductBillDto } from "./product-bill.dto";

export class CreateBillDto {
    @ApiProperty()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({},{message: "Email is invalid"})
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(10)
    @IsNumberString()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    storeId: string;

    @ApiProperty()
    @IsNotEmpty()
    storeName: string;

    @ApiProperty({ type: [ProductBillDto] })
    @IsNotEmpty()
    listProducts: ProductBillDto[];

    @ApiProperty()
    promotionId: string;

    @ApiProperty()
    promotionName: string;

    @ApiProperty()
    promotionValue: number;

    @ApiProperty()
    @IsNotEmpty()
    paymentMethod: string;
}