import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import mongoose, { Types } from "mongoose";

export class CreateCommentDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    createAt: Date = new Date();

    @IsNotEmpty()
    updateAt: Date = new Date();
}