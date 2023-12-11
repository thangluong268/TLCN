import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class ProductDto {
    @ApiProperty()
    @IsNotEmpty()
    _id: string;

    @ApiProperty({type: [String]})
    @IsNotEmpty()
    avatar: string[];

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty()
    @IsNotEmpty()
    categoryName: string;

    @ApiProperty({type: [String]})
    @IsNotEmpty()
    keywords: string[];

    @ApiProperty()
    @IsNotEmpty()
    storeId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    storeName: string;

    @ApiProperty()
    @IsNotEmpty()
    quantitySold: number;

    @ApiProperty()
    @IsNotEmpty()
    quantityGive: number;

    @ApiProperty()
    @IsNotEmpty()
    revenue: number;

}


export class FilterProduct {
    @ApiProperty({ description: 'Filter Price Min', type: Number, required: false, example: 100000 })
    priceMin?: number;

    @ApiProperty({ description: 'Filter Price Max', type: Number, required: false, example: 300000 })
    priceMax?: number;
  
    @ApiProperty({ description: 'Filter Quantity Min', type: Number, required: false, example: 1 })
    quantityMin?: number;

    @ApiProperty({ description: 'Filter Quantity Max', type: Number, required: false, example: 10 })
    quantityMax?: number;
  
    @ApiProperty({ description: 'Filter createdAt Min', required: false, example: '2023-01-01' })
    @Transform(({ value }) => (value ? new Date(value) : null))
    createdAtMin?: Date;

    @ApiProperty({ description: 'Filter createdAt Max', required: false, example: '2024-01-01' })
    @Transform(({ value }) => (value ? new Date(value) : null))
    createdAtMax?: Date;

  }