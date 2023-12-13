import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import { SignUpDto } from "./signup.dto";
import { Type } from "class-transformer";
import { CreateStoreDto } from "../../store/dto/create-store.dto";

export class SeedDto {

    @Type(() => SignUpDto)
    @ApiProperty({ type: [SignUpDto] })
    @IsNotEmpty()
    users: SignUpDto[];

    @Type(() => CreateStoreDto)
    @ApiProperty({ type: [CreateStoreDto] })
    @IsNotEmpty()
    stores: CreateStoreDto[];
}