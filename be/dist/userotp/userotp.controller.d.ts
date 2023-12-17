import { BadRequestException, ConflictException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { CheckUserotpDto } from './dto/check-userotp.dto';
import { CreateUserotpDto } from './dto/create-userotp.dto';
import { UserotpService } from './userotp.service';
export declare class UserotpController {
    private readonly userotpService;
    private readonly userService;
    private firebaseApp;
    private auth;
    constructor(userotpService: UserotpService, userService: UserService, firebaseApp: FirebaseService);
    sendOtp(req: CreateUserotpDto): Promise<SuccessResponse | NotFoundException | ConflictException>;
    checkOtp(req: CheckUserotpDto): Promise<SuccessResponse | NotFoundException>;
    sendOtpForget(req: CreateUserotpDto): Promise<SuccessResponse | NotFoundException | BadRequestException>;
}
