import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { FirebaseService } from '../../firebase/firebase.service';
export declare class JwtATAuthGuard implements CanActivate {
    private jwtService;
    private userService;
    private reflector;
    private firebaseApp;
    private auth;
    constructor(jwtService: JwtService, userService: UserService, reflector: Reflector, firebaseApp: FirebaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
