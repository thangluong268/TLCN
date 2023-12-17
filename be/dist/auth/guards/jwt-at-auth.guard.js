"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtATAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../../user/user.service");
const firebase_service_1 = require("../../firebase/firebase.service");
const role_schema_1 = require("../../role/schema/role.schema");
let JwtATAuthGuard = class JwtATAuthGuard {
    constructor(jwtService, userService, reflector, firebaseApp) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.reflector = reflector;
        this.firebaseApp = firebaseApp;
        this.auth = firebaseApp.getAuth();
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            return false;
        }
        try {
            const payLoadFirebaseAuth = await this.auth.verifyIdToken(token.replace('Bearer ', ''));
            if (payLoadFirebaseAuth.email) {
                request['user'] = {
                    userId: payLoadFirebaseAuth.uid,
                    role: role_schema_1.RoleName.USER,
                    iat: payLoadFirebaseAuth.iat,
                    exp: payLoadFirebaseAuth.exp,
                };
            }
        }
        catch {
            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                });
                await this.userService.getById(payload.userId);
                request['user'] = payload;
            }
            catch {
                return false;
            }
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.JwtATAuthGuard = JwtATAuthGuard;
exports.JwtATAuthGuard = JwtATAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        core_1.Reflector,
        firebase_service_1.FirebaseService])
], JwtATAuthGuard);
//# sourceMappingURL=jwt-at-auth.guard.js.map