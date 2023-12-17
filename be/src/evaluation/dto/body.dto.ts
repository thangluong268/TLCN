import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, IsString, MinLength } from "class-validator";

export class EvaluationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}