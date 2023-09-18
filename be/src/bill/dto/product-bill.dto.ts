import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";

export class ProductBillDto {
    @ApiProperty()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    price: number;
}