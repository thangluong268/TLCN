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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const abilities_decorator_1 = require("../ability/decorators/abilities.decorator");
const role_decorator_1 = require("../ability/decorators/role.decorator");
const abilities_guard_1 = require("../ability/guards/abilities.guard");
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const evaluation_service_1 = require("../evaluation/evaluation.service");
const product_service_1 = require("../product/product.service");
const error_responseDto_1 = require("../responses/error.responseDto");
const success_responseDto_1 = require("../responses/success.responseDto");
const role_service_1 = require("../role/role.service");
const role_schema_1 = require("../role/schema/role.schema");
const store_service_1 = require("../store/store.service");
const user_service_1 = require("../user/user.service");
const usertoken_service_1 = require("../usertoken/usertoken.service");
const auth_service_1 = require("./auth.service");
const get_current_userid_decorator_1 = require("./decorators/get-current-userid.decorator");
const public_decorator_1 = require("./decorators/public.decorator");
const login_dto_1 = require("./dto/login.dto");
const seed_dto_1 = require("./dto/seed.dto");
const signup_dto_1 = require("./dto/signup.dto");
const jwt_rt_auth_guard_1 = require("./guards/jwt-rt-auth.guard");
let AuthController = class AuthController {
    constructor(authService, roleService, userService, userTokenService, storeService, productService, evaluationService) {
        this.authService = authService;
        this.roleService = roleService;
        this.userService = userService;
        this.userTokenService = userTokenService;
        this.storeService = storeService;
        this.productService = productService;
        this.evaluationService = evaluationService;
    }
    async signUp(signUpDto) {
        const user = await this.userService.getByEmail(signUpDto.email);
        if (user)
            return new error_response_1.ConflictException('Email đã tồn tại!');
        const hashedPassword = await this.authService.hashData(signUpDto.password);
        signUpDto.password = hashedPassword;
        const newUser = await this.userService.create(signUpDto);
        const payload = { userId: newUser._id };
        const tokens = await this.authService.getTokens(payload);
        await this.userTokenService.createUserToken(newUser._id, tokens.refreshToken);
        const resultAddRole = await this.roleService.addUserToRole(newUser._id, {
            name: role_schema_1.RoleName.USER,
        });
        if (!resultAddRole)
            return new error_response_1.BadRequestException('Không thể tạo user này!');
        return new success_response_1.SuccessResponse({
            message: 'Đăng ký thành công!',
            metadata: { data: newUser },
        });
    }
    async login(loginDto) {
        const user = await this.userService.getByEmail(loginDto.email);
        if (!user)
            return new error_response_1.BadRequestException('Email hoặc mật khẩu không chính xác!');
        const { password, ...userWithoutPass } = user['_doc'];
        const isMatch = await this.authService.compareData(loginDto.password, password);
        if (!isMatch)
            return new error_response_1.BadRequestException('Email hoặc mật khẩu không chính xác!');
        const payload = { userId: user._id };
        const tokens = await this.authService.getTokens(payload);
        const userToken = await this.userTokenService.getUserTokenById(user._id);
        userToken
            ? await this.userTokenService.updateUserToken(user._id, tokens.refreshToken)
            : await this.userTokenService.createUserToken(user._id, tokens.refreshToken);
        const role = await this.roleService.getRoleNameByUserId(user._id);
        return new success_response_1.SuccessResponse({
            message: 'Đăng nhập thành công!',
            metadata: {
                data: {
                    providerData: [userWithoutPass],
                    stsTokenManager: tokens,
                    role,
                },
            },
        });
    }
    async forgetPassword(loginDto) {
        const { email, password } = loginDto;
        const hashedPassword = await this.authService.hashData(password);
        const user = await this.userService.updatePassword(email, hashedPassword);
        return new success_response_1.SuccessResponse({
            message: 'Lấy lại mật khẩu thành công!',
            metadata: { data: user.email },
        });
    }
    async logout(userId) {
        const result = await this.userTokenService.deleteUserToken(userId);
        if (!result)
            return new error_response_1.ForbiddenException('Không thể đăng xuất!');
        return new success_response_1.SuccessResponse({
            message: 'Đăng xuất thành công!',
            metadata: { data: result },
        });
    }
    async refreshToken(userId, req) {
        const refreshToken = req.user['refreshToken'];
        const userToken = await this.userTokenService.getUserTokenById(userId);
        await this.authService.compareData(refreshToken, userToken.hashedRefreshToken);
        const payload = { userId: userToken.userId };
        const tokens = await this.authService.getTokens(payload);
        const result = await this.userTokenService.updateUserToken(userToken.userId, tokens.refreshToken);
        if (!result)
            return new error_response_1.ForbiddenException('Không thể tạo token mới!');
        return new success_response_1.SuccessResponse({
            message: 'Tạo token mới thành công!',
            metadata: { data: tokens },
        });
    }
    async createUser(signUpDto) {
        const hashedPassword = await this.authService.hashData(signUpDto.password);
        signUpDto.password = hashedPassword;
        const newUser = await this.userService.create(signUpDto);
        const payload = { userId: newUser._id };
        const tokens = await this.authService.getTokens(payload);
        await this.userTokenService.createUserToken(newUser._id, tokens.refreshToken);
        return new success_response_1.SuccessResponse({
            message: 'Đăng ký thành công!',
            metadata: { data: newUser },
        });
    }
    async createMultiUsers(seedDto) {
        const dataUsers = await Promise.all(seedDto.users.map(async (user) => {
            let hashedPassword = await this.authService.hashData(user.password);
            user.password = hashedPassword;
            let newUser = await this.userService.create(user);
            let payload = { userId: newUser._id };
            let tokens = await this.authService.getTokens(payload);
            await this.userTokenService.createUserToken(newUser._id, tokens.refreshToken);
            let resultAddRole = await this.roleService.addUserToRole(newUser._id, { name: role_schema_1.RoleName.USER });
            if (!resultAddRole)
                return new error_response_1.BadRequestException('Không thể tạo user này!');
            return newUser;
        }));
        const userIds = dataUsers.map((user) => user._id);
        const dataStores = await Promise.all(seedDto.stores.map(async (store, index) => {
            store.phoneNumber = [dataUsers[index].phone];
            let newStore = await this.storeService.create(userIds[index], store);
            await this.roleService.addUserToRole(userIds[index], {
                name: role_schema_1.RoleName.SELLER,
            });
            return newStore;
        }));
        const storeIds = dataStores.map((store) => store._id);
        return new success_response_1.SuccessResponse({
            message: 'Tạo nhiều data thành công!',
            metadata: { userIds, storeIds },
        });
    }
    async createMultiProducts(seedProductDto) {
        const productIds = await Promise.all(seedProductDto.map(async (product) => {
            const { storeId, ...productData } = product;
            const newProduct = await this.productService.create(storeId, productData);
            await this.evaluationService.create(newProduct._id);
            return newProduct._id.toString();
        }));
        return new success_response_1.SuccessResponse({
            message: 'Tạo nhiều data thành công!',
            metadata: { productIds },
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Get list users', type: success_responseDto_1.SuccessResponseDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid user data', type: error_responseDto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgetPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ManageUserTokenAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER, role_schema_1.RoleName.SELLER, role_schema_1.RoleName.MANAGER, role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)('logout'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwt_rt_auth_guard_1.JwtRTAuthGuard, abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ManageUserTokenAbility()),
    (0, common_1.Post)('refresh'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Post)('createUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiBody)({ type: seed_dto_1.SeedDto }),
    (0, common_1.Post)('create-multi-users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seed_dto_1.SeedDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createMultiUsers", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiBody)({ type: [seed_dto_1.SeedProductDto] }),
    (0, common_1.Post)('create-multi-products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createMultiProducts", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        role_service_1.RoleService,
        user_service_1.UserService,
        usertoken_service_1.UsertokenService,
        store_service_1.StoreService,
        product_service_1.ProductService,
        evaluation_service_1.EvaluationService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map