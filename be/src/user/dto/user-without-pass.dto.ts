import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import mongoose from "mongoose";

export class UserWithoutPassDto {
    _id: mongoose.Types.ObjectId;
    avatar: string;
    fullName: string;
    email: string;
    address: string;
    phone: string;
    gender: string;
    birthday: Date;
    listFriends: mongoose.Types.ObjectId[];
    listFollows: mongoose.Types.ObjectId[];
    warning: number;
    status: boolean;
}