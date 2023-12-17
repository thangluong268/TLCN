import { UserWithoutPassDto } from "../../user/dto/user-without-pass.dto";
import { TokensDto } from "./tokens.dto";
export declare class UserDto {
    providerData: UserWithoutPassDto[];
    stsTokenManager: TokensDto;
}
