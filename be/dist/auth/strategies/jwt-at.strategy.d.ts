import { Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";
declare const JwtATStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtATStrategy extends JwtATStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<{
        userId: any;
    }>;
}
export {};
