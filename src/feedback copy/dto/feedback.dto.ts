import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FeedbackDto {
    @ApiProperty()
    @IsNotEmpty()
    star: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({type: [String]})
    @IsNotEmpty()
    consensus: string[];

    @ApiProperty()
    @IsNotEmpty()
    isConsensus: boolean = false;
}