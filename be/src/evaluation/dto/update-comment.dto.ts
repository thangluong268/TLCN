import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import mongoose, { Types } from "mongoose";

export class UpdateCommentDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    content: string;

    createAt: Date;

    @IsNotEmpty()
    updateAt: Date = new Date();
}