import { IsNotEmpty } from "class-validator";
import { UserWithoutPassDto } from "../../user/dto/user-without-pass.dto";

export class TokensDto {
    @IsNotEmpty()
    accessToken: string;

    @IsNotEmpty()
    refreshToken: string;
}