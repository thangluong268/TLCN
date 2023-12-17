import { Request } from "express";
import { Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";
declare const JwtRTStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRTStrategy extends JwtRTStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(req: Request, payload: any): Promise<{
        userId: any;
        refreshToken: string;
    }>;
}
export {};
