import { JwtService } from '@nestjs/jwt';
import { TokensDto } from './dto/tokens.dto';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    getTokens(payload: any): Promise<TokensDto>;
    hashData(data: string): Promise<string>;
    compareData(data: string, hashedData: string): Promise<boolean>;
}
