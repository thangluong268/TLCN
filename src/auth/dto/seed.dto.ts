import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, IsPhoneNumber, Length, MinLength } from "class-validator";
import { SignUpDto } from "./signup.dto";
import { Type } from "class-transformer";
import { CreateStoreDto } from "../../store/dto/create-store.dto";
import { CreateProductDto } from "../../product/dto/create-product.dto";

export class SeedUserDto {
    @ApiProperty()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, { message: "Email is invalid" })
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber("VN")
    @Length(10)
    phone: string;
}

export class SeedStoreDto {
    @ApiProperty()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    phoneNumber: string[];
}

export class SeedDto {

    @Type(() => SeedUserDto)
    @ApiProperty({ type: [SeedUserDto] })
    @IsNotEmpty()
    users: SeedUserDto[];

    @Type(() => SeedStoreDto)
    @ApiProperty({ type: [SeedStoreDto] })
    @IsNotEmpty()
    stores: SeedStoreDto[];

    @Type(() => CreateProductDto)
    @ApiProperty({ type: [CreateProductDto] })
    @IsNotEmpty()
    products: CreateProductDto[];
}