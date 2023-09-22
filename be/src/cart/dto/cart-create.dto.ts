import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import mongoose from "mongoose";
import { ProductBillDto } from "src/bill/dto/product-bill.dto";

export class CreateCartDto {
    @ApiProperty()
    @IsNotEmpty()
    storeName: string;

    @ApiProperty({ type: [ProductBillDto] })
    @IsNotEmpty()
    listProducts: ProductBillDto[];
}