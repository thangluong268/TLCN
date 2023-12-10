import { IsNotEmpty } from "class-validator";
import { UserWithoutPassDto } from "../../user/dto/user-without-pass.dto";
import { TokensDto } from "./tokens.dto";

export class UserDto {
    @IsNotEmpty()
    providerData: UserWithoutPassDto[];

    @IsNotEmpty()
    stsTokenManager: TokensDto;
}