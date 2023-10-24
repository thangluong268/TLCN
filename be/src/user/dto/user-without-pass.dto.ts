import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import mongoose from "mongoose";

export class UserWithoutPassDto {
    _id: string;
    avatar: string;
    fullName: string;
    email: string;
    address: string;
    phone: string;
    gender: string;
    birthday: Date;
    friends: String[];
    followStores: String[];
    warningCount: number;
    status: boolean;
}