import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from "class-validator";
import mongoose, { Types } from "mongoose";

export class CreateNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    type: string;
}