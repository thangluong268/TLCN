import { IsNotEmpty } from "class-validator";

export class TokensDto {
    @IsNotEmpty()
    accessToken: string;

    @IsNotEmpty()
    refreshToken: string;
}