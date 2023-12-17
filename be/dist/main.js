/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.slice(1) || 0;
	var log = __webpack_require__(1);

	/**
	 * @param {boolean=} fromUpdate true when called from update
	 */
	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const swagger_1 = __webpack_require__(13);
const swagger_2 = __webpack_require__(149);
const common_1 = __webpack_require__(6);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });
    app.setGlobalPrefix('/api');
    swagger_1.SwaggerModule.setup('api', app, (0, swagger_2.createDocument)(app), {
        swaggerOptions: {
            persistAuthorization: true,
        }
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(7);
const auth_module_1 = __webpack_require__(8);
const policy_module_1 = __webpack_require__(115);
const role_module_1 = __webpack_require__(71);
const ability_module_1 = __webpack_require__(64);
const bill_module_1 = __webpack_require__(65);
const usertoken_module_1 = __webpack_require__(112);
const user_module_1 = __webpack_require__(63);
const firebase_module_1 = __webpack_require__(114);
const userotp_module_1 = __webpack_require__(120);
const handlebars_adapter_1 = __webpack_require__(126);
const path_1 = __webpack_require__(127);
const mailer_1 = __webpack_require__(122);
const cart_module_1 = __webpack_require__(66);
const store_module_1 = __webpack_require__(82);
const feedback_module_1 = __webpack_require__(87);
const product_module_1 = __webpack_require__(74);
const seeds_module_1 = __webpack_require__(128);
const evaluation_module_1 = __webpack_require__(90);
const notification_module_1 = __webpack_require__(93);
const promotion_module_1 = __webpack_require__(131);
const fine_module_1 = __webpack_require__(135);
const category_module_1 = __webpack_require__(97);
const cloudinary_module_1 = __webpack_require__(140);
const database_module_1 = __webpack_require__(147);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (config) => ({
                    transport: {
                        port: 465,
                        ignoreTLS: true,
                        host: config.get('MAIL_HOST'),
                        secure: true,
                        auth: {
                            user: config.get('MAIL_USER'),
                            pass: config.get('MAIL_PASSWORD'),
                        },
                    },
                    defaults: {
                        from: `"No Reply" <${config.get('MAIL_USER')}>`,
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, 'src/templates'),
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            policy_module_1.PolicyModule,
            role_module_1.RoleModule,
            ability_module_1.AbilityModule,
            firebase_module_1.FirebaseModule,
            bill_module_1.BillModule,
            usertoken_module_1.UsertokenModule,
            userotp_module_1.UserotpModule,
            cart_module_1.CartModule,
            store_module_1.StoreModule,
            feedback_module_1.FeedbackModule,
            product_module_1.ProductModule,
            seeds_module_1.SeedsModule,
            evaluation_module_1.EvaluationModule,
            notification_module_1.NotificationModule,
            promotion_module_1.PromotionModule,
            fine_module_1.FineModule,
            category_module_1.CategoryModule,
            cloudinary_module_1.CloudinaryModule,
        ],
        providers: [],
    })
], AppModule);


/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(9);
const auth_controller_1 = __webpack_require__(12);
const passport_1 = __webpack_require__(62);
const jwt_1 = __webpack_require__(10);
const user_module_1 = __webpack_require__(63);
const role_module_1 = __webpack_require__(71);
const jwt_at_strategy_1 = __webpack_require__(106);
const jwt_rt_strategy_1 = __webpack_require__(108);
const ability_module_1 = __webpack_require__(64);
const core_1 = __webpack_require__(4);
const jwt_at_auth_guard_1 = __webpack_require__(109);
const usertoken_module_1 = __webpack_require__(112);
const firebase_module_1 = __webpack_require__(114);
const store_module_1 = __webpack_require__(82);
const product_module_1 = __webpack_require__(74);
const evaluation_module_1 = __webpack_require__(90);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            user_module_1.UserModule,
            passport_1.PassportModule,
            role_module_1.RoleModule,
            ability_module_1.AbilityModule,
            usertoken_module_1.UsertokenModule,
            firebase_module_1.FirebaseModule,
            store_module_1.StoreModule,
            product_module_1.ProductModule,
            evaluation_module_1.EvaluationModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_at_strategy_1.JwtATStrategy,
            jwt_rt_strategy_1.JwtRTStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_at_auth_guard_1.JwtATAuthGuard,
            },
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(10);
const bcrypt = __webpack_require__(11);
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async getTokens(payload) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
            }),
        ]);
        return {
            accessToken: at,
            refreshToken: rt,
        };
    }
    async hashData(data) {
        const saltOrRounds = Number(process.env.SALT_ROUNDS);
        return await bcrypt.hash(data, saltOrRounds);
    }
    async compareData(data, hashedData) {
        const isMatched = await bcrypt.compare(data, hashedData);
        return isMatched;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);


/***/ }),
/* 10 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const express_1 = __webpack_require__(14);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const error_response_1 = __webpack_require__(41);
const success_response_1 = __webpack_require__(42);
const evaluation_service_1 = __webpack_require__(43);
const product_service_1 = __webpack_require__(45);
const error_responseDto_1 = __webpack_require__(48);
const success_responseDto_1 = __webpack_require__(49);
const role_service_1 = __webpack_require__(39);
const role_schema_1 = __webpack_require__(34);
const store_service_1 = __webpack_require__(50);
const user_service_1 = __webpack_require__(51);
const usertoken_service_1 = __webpack_require__(54);
const auth_service_1 = __webpack_require__(9);
const get_current_userid_decorator_1 = __webpack_require__(55);
const public_decorator_1 = __webpack_require__(56);
const login_dto_1 = __webpack_require__(57);
const seed_dto_1 = __webpack_require__(58);
const signup_dto_1 = __webpack_require__(60);
const jwt_rt_auth_guard_1 = __webpack_require__(61);
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
    __metadata("design:paramtypes", [typeof (_h = typeof signup_dto_1.SignUpDto !== "undefined" && signup_dto_1.SignUpDto) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Get list users', type: success_responseDto_1.SuccessResponseDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid user data', type: error_responseDto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _k : Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgetPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _m : Object]),
    __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ManageUserTokenAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER, role_schema_1.RoleName.SELLER, role_schema_1.RoleName.MANAGER, role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)('logout'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwt_rt_auth_guard_1.JwtRTAuthGuard, abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ManageUserTokenAbility()),
    (0, common_1.Post)('refresh'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_q = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Post)('createUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof signup_dto_1.SignUpDto !== "undefined" && signup_dto_1.SignUpDto) === "function" ? _s : Object]),
    __metadata("design:returntype", typeof (_t = typeof Promise !== "undefined" && Promise) === "function" ? _t : Object)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiBody)({ type: seed_dto_1.SeedDto }),
    (0, common_1.Post)('create-multi-users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof seed_dto_1.SeedDto !== "undefined" && seed_dto_1.SeedDto) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], AuthController.prototype, "createMultiUsers", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiBody)({ type: [seed_dto_1.SeedProductDto] }),
    (0, common_1.Post)('create-multi-products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
], AuthController.prototype, "createMultiProducts", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _b : Object, typeof (_c = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _c : Object, typeof (_d = typeof usertoken_service_1.UsertokenService !== "undefined" && usertoken_service_1.UsertokenService) === "function" ? _d : Object, typeof (_e = typeof store_service_1.StoreService !== "undefined" && store_service_1.StoreService) === "function" ? _e : Object, typeof (_f = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _f : Object, typeof (_g = typeof evaluation_service_1.EvaluationService !== "undefined" && evaluation_service_1.EvaluationService) === "function" ? _g : Object])
], AuthController);


/***/ }),
/* 13 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 14 */
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReadCategoryAbility = exports.CreateCategoryAbility = exports.DeletePolicyAbility = exports.UpdatePolicyAbility = exports.ReadPolicyAbility = exports.CreatePolicyAbility = exports.DeleteFineAbility = exports.UpdateFineAbility = exports.ReadFineAbility = exports.CreateFineAbility = exports.DeletePromotionAbility = exports.UpdatePromotionAbility = exports.ReadPromotionAbility = exports.CreatePromotionAbility = exports.UpdateNotificationAbility = exports.ReadNotificationAbility = exports.UpdateEvaluationAbility = exports.DeleteProductAbility = exports.UpdateProductAbility = exports.ReadProductAbility = exports.CreateProductAbility = exports.UpdateFeedBackAbility = exports.CreateFeedBackAbility = exports.ManageStoreAbility = exports.UpdateStoreAbility = exports.DeleteStoreAbility = exports.ReadStoreAbility = exports.CreateStoreAbility = exports.UpdateCartAbility = exports.ReadCartAbility = exports.CreateCartAbility = exports.UpdateBillAbility = exports.ReadBillAbility = exports.CreateBillAbility = exports.ManageUserTokenAbility = exports.CreateUserotpAbility = exports.DeleteUserAbility = exports.UpdateUserAbility = exports.ReadUserAbility = exports.CreateUserAbility = exports.CreateRoleAbility = exports.UpdateRoleAbility = exports.ReadRoleAbility = exports.CheckAbilities = exports.CHECK_ABILITY = void 0;
const common_1 = __webpack_require__(6);
const bill_schema_1 = __webpack_require__(16);
const cart_schema_1 = __webpack_require__(22);
const category_schema_1 = __webpack_require__(23);
const evaluation_schema_1 = __webpack_require__(24);
const feedback_schema_1 = __webpack_require__(25);
const notification_schema_1 = __webpack_require__(26);
const product_schema_1 = __webpack_require__(28);
const promotion_schema_1 = __webpack_require__(29);
const store_schema_1 = __webpack_require__(30);
const user_schema_1 = __webpack_require__(31);
const userotp_schema_1 = __webpack_require__(32);
const usertoken_schema_1 = __webpack_require__(33);
const role_schema_1 = __webpack_require__(34);
const ability_factory_1 = __webpack_require__(35);
exports.CHECK_ABILITY = 'check_ability';
const CheckAbilities = (...requirements) => (0, common_1.SetMetadata)(exports.CHECK_ABILITY, requirements);
exports.CheckAbilities = CheckAbilities;
class ReadRoleAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = role_schema_1.Role;
    }
}
exports.ReadRoleAbility = ReadRoleAbility;
class UpdateRoleAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = role_schema_1.Role;
    }
}
exports.UpdateRoleAbility = UpdateRoleAbility;
class CreateRoleAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = role_schema_1.Role;
    }
}
exports.CreateRoleAbility = CreateRoleAbility;
class CreateUserAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = user_schema_1.User;
    }
}
exports.CreateUserAbility = CreateUserAbility;
class ReadUserAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = user_schema_1.User;
    }
}
exports.ReadUserAbility = ReadUserAbility;
class UpdateUserAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = user_schema_1.User;
    }
}
exports.UpdateUserAbility = UpdateUserAbility;
class DeleteUserAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = user_schema_1.User;
    }
}
exports.DeleteUserAbility = DeleteUserAbility;
class CreateUserotpAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = userotp_schema_1.Userotp;
    }
}
exports.CreateUserotpAbility = CreateUserotpAbility;
class ManageUserTokenAbility {
    constructor() {
        this.action = ability_factory_1.Action.Manage;
        this.subject = usertoken_schema_1.UserToken;
    }
}
exports.ManageUserTokenAbility = ManageUserTokenAbility;
class CreateBillAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = bill_schema_1.Bill;
    }
}
exports.CreateBillAbility = CreateBillAbility;
class ReadBillAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = bill_schema_1.Bill;
    }
}
exports.ReadBillAbility = ReadBillAbility;
class UpdateBillAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = bill_schema_1.Bill;
    }
}
exports.UpdateBillAbility = UpdateBillAbility;
class CreateCartAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = cart_schema_1.Cart;
    }
}
exports.CreateCartAbility = CreateCartAbility;
class ReadCartAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = cart_schema_1.Cart;
    }
}
exports.ReadCartAbility = ReadCartAbility;
class UpdateCartAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = cart_schema_1.Cart;
    }
}
exports.UpdateCartAbility = UpdateCartAbility;
class CreateStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = store_schema_1.Store;
    }
}
exports.CreateStoreAbility = CreateStoreAbility;
class ReadStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = store_schema_1.Store;
    }
}
exports.ReadStoreAbility = ReadStoreAbility;
class DeleteStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = store_schema_1.Store;
    }
}
exports.DeleteStoreAbility = DeleteStoreAbility;
class UpdateStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = store_schema_1.Store;
    }
}
exports.UpdateStoreAbility = UpdateStoreAbility;
class ManageStoreAbility {
    constructor() {
        this.action = ability_factory_1.Action.Manage;
        this.subject = store_schema_1.Store;
    }
}
exports.ManageStoreAbility = ManageStoreAbility;
class CreateFeedBackAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = feedback_schema_1.Feedback;
    }
}
exports.CreateFeedBackAbility = CreateFeedBackAbility;
class UpdateFeedBackAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = feedback_schema_1.Feedback;
    }
}
exports.UpdateFeedBackAbility = UpdateFeedBackAbility;
class CreateProductAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = product_schema_1.Product;
    }
}
exports.CreateProductAbility = CreateProductAbility;
class ReadProductAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = product_schema_1.Product;
    }
}
exports.ReadProductAbility = ReadProductAbility;
class UpdateProductAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = product_schema_1.Product;
    }
}
exports.UpdateProductAbility = UpdateProductAbility;
class DeleteProductAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = product_schema_1.Product;
    }
}
exports.DeleteProductAbility = DeleteProductAbility;
class UpdateEvaluationAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = evaluation_schema_1.Evaluation;
    }
}
exports.UpdateEvaluationAbility = UpdateEvaluationAbility;
class ReadNotificationAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = notification_schema_1.Notification;
    }
}
exports.ReadNotificationAbility = ReadNotificationAbility;
class UpdateNotificationAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = notification_schema_1.Notification;
    }
}
exports.UpdateNotificationAbility = UpdateNotificationAbility;
class CreatePromotionAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.CreatePromotionAbility = CreatePromotionAbility;
class ReadPromotionAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.ReadPromotionAbility = ReadPromotionAbility;
class UpdatePromotionAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.UpdatePromotionAbility = UpdatePromotionAbility;
class DeletePromotionAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.DeletePromotionAbility = DeletePromotionAbility;
class CreateFineAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.CreateFineAbility = CreateFineAbility;
class ReadFineAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.ReadFineAbility = ReadFineAbility;
class UpdateFineAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.UpdateFineAbility = UpdateFineAbility;
class DeleteFineAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.DeleteFineAbility = DeleteFineAbility;
class CreatePolicyAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.CreatePolicyAbility = CreatePolicyAbility;
class ReadPolicyAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.ReadPolicyAbility = ReadPolicyAbility;
class UpdatePolicyAbility {
    constructor() {
        this.action = ability_factory_1.Action.Update;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.UpdatePolicyAbility = UpdatePolicyAbility;
class DeletePolicyAbility {
    constructor() {
        this.action = ability_factory_1.Action.Delete;
        this.subject = promotion_schema_1.Promotion;
    }
}
exports.DeletePolicyAbility = DeletePolicyAbility;
class CreateCategoryAbility {
    constructor() {
        this.action = ability_factory_1.Action.Create;
        this.subject = category_schema_1.Category;
    }
}
exports.CreateCategoryAbility = CreateCategoryAbility;
class ReadCategoryAbility {
    constructor() {
        this.action = ability_factory_1.Action.Read;
        this.subject = category_schema_1.Category;
    }
}
exports.ReadCategoryAbility = ReadCategoryAbility;


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSchema = exports.Bill = exports.PRODUCT_TYPE = exports.BILL_STATUS_TRANSITION = exports.BILL_STATUS = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const create_bill_dto_1 = __webpack_require__(19);
exports.BILL_STATUS = 'NEW-CONFIRMED-DELIVERING-DELIVERED-CANCELLED-RETURNED';
exports.BILL_STATUS_TRANSITION = {
    NEW: 'Đơn mới',
    CONFIRMED: 'Đang chuẩn bị',
    DELIVERING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Đã hoàn',
};
var PRODUCT_TYPE;
(function (PRODUCT_TYPE) {
    PRODUCT_TYPE["SELL"] = "SELL";
    PRODUCT_TYPE["GIVE"] = "GIVE";
})(PRODUCT_TYPE || (exports.PRODUCT_TYPE = PRODUCT_TYPE = {}));
let Bill = class Bill extends mongoose_2.Document {
};
exports.Bill = Bill;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "storeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], Bill.prototype, "listProducts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Bill.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "deliveryMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", typeof (_a = typeof create_bill_dto_1.ReceiverInfo !== "undefined" && create_bill_dto_1.ReceiverInfo) === "function" ? _a : Object)
], Bill.prototype, "receiverInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object || null }),
    __metadata("design:type", typeof (_b = typeof create_bill_dto_1.GiveInfo !== "undefined" && create_bill_dto_1.GiveInfo) === "function" ? _b : Object)
], Bill.prototype, "giveInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Bill.prototype, "deliveryFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'NEW' }),
    __metadata("design:type", String)
], Bill.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Bill.prototype, "isPaid", void 0);
exports.Bill = Bill = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Bill);
exports.BillSchema = mongoose_1.SchemaFactory.createForClass(Bill);


/***/ }),
/* 17 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/mongoose");

/***/ }),
/* 18 */
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBillDto = exports.GiveInfo = exports.ReceiverInfo = exports.CartInfo = exports.ProductInfo = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
const payment_gateway_1 = __webpack_require__(21);
class ProductInfo {
}
exports.ProductInfo = ProductInfo;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductInfo.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductInfo.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductInfo.prototype, "type", void 0);
class CartInfo {
}
exports.CartInfo = CartInfo;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CartInfo.prototype, "storeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductInfo] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CartInfo.prototype, "listProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CartInfo.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CartInfo.prototype, "totalPrice", void 0);
class ReceiverInfo {
}
exports.ReceiverInfo = ReceiverInfo;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiverInfo.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiverInfo.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiverInfo.prototype, "address", void 0);
class GiveInfo {
}
exports.GiveInfo = GiveInfo;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GiveInfo.prototype, "senderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GiveInfo.prototype, "wish", void 0);
class GiveInfoExample {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Van A" }),
    __metadata("design:type", String)
], GiveInfoExample.prototype, "senderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "wish something" }),
    __metadata("design:type", String)
], GiveInfoExample.prototype, "wish", void 0);
class CreateBillDto {
}
exports.CreateBillDto = CreateBillDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CartInfo] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateBillDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof payment_gateway_1.PAYMENT_METHOD !== "undefined" && payment_gateway_1.PAYMENT_METHOD) === "function" ? _a : Object)
], CreateBillDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReceiverInfo }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", ReceiverInfo)
], CreateBillDto.prototype, "receiverInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: GiveInfo || null, example: GiveInfoExample || null }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", GiveInfo)
], CreateBillDto.prototype, "giveInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "deliveryFee", void 0);


/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiveGateway = exports.MoMoGateway = exports.VNPayGateway = exports.PAYMENT_METHOD = void 0;
var PAYMENT_METHOD;
(function (PAYMENT_METHOD) {
    PAYMENT_METHOD["VNPAY"] = "vnpay";
    PAYMENT_METHOD["MOMO"] = "momo";
    PAYMENT_METHOD["GIVE"] = "give";
})(PAYMENT_METHOD || (exports.PAYMENT_METHOD = PAYMENT_METHOD = {}));
class VNPayGateway {
    processPayment(bill) {
        return 1;
    }
}
exports.VNPayGateway = VNPayGateway;
class MoMoGateway {
    processPayment(bill) {
        return 2;
    }
}
exports.MoMoGateway = MoMoGateway;
class GiveGateway {
    processPayment(bill) {
        return 0;
    }
}
exports.GiveGateway = GiveGateway;


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartSchema = exports.Cart = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let Cart = class Cart extends mongoose_2.Document {
};
exports.Cart = Cart;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Cart.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Cart.prototype, "storeId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Cart.prototype, "storeAvatar", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Cart.prototype, "storeName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], Cart.prototype, "listProducts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Cart.prototype, "totalPrice", void 0);
exports.Cart = Cart = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Cart);
exports.CartSchema = mongoose_1.SchemaFactory.createForClass(Cart);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategorySchema = exports.Category = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let Category = class Category extends mongoose_2.Document {
};
exports.Category = Category;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Category.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Category.prototype, "status", void 0);
exports.Category = Category = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Category);
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EvaluationSchema = exports.Evaluation = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let Evaluation = class Evaluation extends mongoose_2.Document {
};
exports.Evaluation = Evaluation;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Evaluation.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], Evaluation.prototype, "emojis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], Evaluation.prototype, "hadEvaluation", void 0);
exports.Evaluation = Evaluation = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Evaluation);
exports.EvaluationSchema = mongoose_1.SchemaFactory.createForClass(Evaluation);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackSchema = exports.Feedback = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let Feedback = class Feedback extends mongoose_2.Document {
};
exports.Feedback = Feedback;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Feedback.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Feedback.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Feedback.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Feedback.prototype, "star", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Feedback.prototype, "consensus", void 0);
exports.Feedback = Feedback = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Feedback);
exports.FeedbackSchema = mongoose_1.SchemaFactory.createForClass(Feedback);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationSchema = exports.Notification = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const sub_notification_dto_1 = __webpack_require__(27);
let Notification = class Notification extends mongoose_2.Document {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Notification.prototype, "userIdFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Notification.prototype, "userIdTo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Notification.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof sub_notification_dto_1.SubNoti !== "undefined" && sub_notification_dto_1.SubNoti) === "function" ? _a : Object)
], Notification.prototype, "sub", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubNoti = void 0;
class SubNoti {
    constructor() {
        this.productId = '';
    }
}
exports.SubNoti = SubNoti;


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductSchema = exports.Product = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let Product = class Product extends mongoose_2.Document {
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Product.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Product.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Product.prototype, "keywords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "storeId", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionSchema = exports.Promotion = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let Promotion = class Promotion extends mongoose_2.Document {
};
exports.Promotion = Promotion;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Promotion.prototype, "photo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "promotionName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Promotion.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Promotion.prototype, "days", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Promotion.prototype, "productTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Promotion.prototype, "status", void 0);
exports.Promotion = Promotion = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Promotion);
exports.PromotionSchema = mongoose_1.SchemaFactory.createForClass(Promotion);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoreSchema = exports.Store = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let Store = class Store extends mongoose_2.Document {
};
exports.Store = Store;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Store.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Store.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Store.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ types: [String] }),
    __metadata("design:type", Array)
], Store.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Store.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Store.prototype, "warningCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Store.prototype, "status", void 0);
exports.Store = Store = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Store);
exports.StoreSchema = mongoose_1.SchemaFactory.createForClass(Store);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let User = class User extends mongoose_2.Document {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], User.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "followStores", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "wallet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "warningCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "true" }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserotpSchema = exports.Userotp = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let Userotp = class Userotp extends mongoose_2.Document {
};
exports.Userotp = Userotp;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Userotp.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", typeof (_a = typeof Number !== "undefined" && Number) === "function" ? _a : Object)
], Userotp.prototype, "otp", void 0);
exports.Userotp = Userotp = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Userotp);
exports.UserotpSchema = mongoose_1.SchemaFactory.createForClass(Userotp);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserTokenSchema = exports.UserToken = void 0;
const mongoose_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(20);
const mongoose_2 = __webpack_require__(18);
let UserToken = class UserToken extends mongoose_2.Document {
};
exports.UserToken = UserToken;
__decorate([
    (0, mongoose_1.Prop)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserToken.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserToken.prototype, "hashedRefreshToken", void 0);
exports.UserToken = UserToken = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], UserToken);
exports.UserTokenSchema = mongoose_1.SchemaFactory.createForClass(UserToken);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleSchema = exports.Role = exports.RoleName = void 0;
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
var RoleName;
(function (RoleName) {
    RoleName["USER"] = "User";
    RoleName["SELLER"] = "Seller";
    RoleName["MANAGER"] = "Manager";
    RoleName["ADMIN"] = "Admin";
})(RoleName || (exports.RoleName = RoleName = {}));
let Role = class Role extends mongoose_2.Document {
};
exports.Role = Role;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Role.prototype, "listUser", void 0);
exports.Role = Role = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Role);
exports.RoleSchema = mongoose_1.SchemaFactory.createForClass(Role);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbilityFactory = exports.Action = void 0;
const ability_1 = __webpack_require__(36);
const common_1 = __webpack_require__(6);
const bill_schema_1 = __webpack_require__(16);
const cart_schema_1 = __webpack_require__(22);
const evaluation_schema_1 = __webpack_require__(24);
const feedback_schema_1 = __webpack_require__(25);
const notification_schema_1 = __webpack_require__(26);
const product_schema_1 = __webpack_require__(28);
const promotion_schema_1 = __webpack_require__(29);
const role_schema_1 = __webpack_require__(34);
const store_schema_1 = __webpack_require__(30);
const user_schema_1 = __webpack_require__(31);
const usertoken_schema_1 = __webpack_require__(33);
var Action;
(function (Action) {
    Action["Manage"] = "manage";
    Action["Create"] = "create";
    Action["Read"] = "read";
    Action["Update"] = "update";
    Action["Delete"] = "delete";
    Action["Orther"] = "orther";
})(Action || (exports.Action = Action = {}));
let AbilityFactory = class AbilityFactory {
    defineAbility(role) {
        const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
        switch (role) {
            case role_schema_1.RoleName.ADMIN:
                can(Action.Manage, 'all');
                break;
            case role_schema_1.RoleName.USER:
                can(Action.Manage, usertoken_schema_1.UserToken);
                can(Action.Manage, bill_schema_1.Bill);
                can(Action.Manage, cart_schema_1.Cart);
                can(Action.Create, store_schema_1.Store);
                can(Action.Read, store_schema_1.Store);
                can(Action.Read, user_schema_1.User);
                can(Action.Update, user_schema_1.User);
                can(Action.Delete, user_schema_1.User);
                can(Action.Manage, feedback_schema_1.Feedback);
                can(Action.Update, evaluation_schema_1.Evaluation);
                can(Action.Read, evaluation_schema_1.Evaluation);
                can(Action.Manage, notification_schema_1.Notification);
                can(Action.Manage, promotion_schema_1.Promotion);
                cannot(Action.Read, role_schema_1.Role).because('Không cho đọc role!');
                cannot(Action.Create, product_schema_1.Product).because('Không cho tạo sản phẩm!');
                break;
            case role_schema_1.RoleName.SELLER:
                can(Action.Manage, usertoken_schema_1.UserToken);
                can(Action.Read, bill_schema_1.Bill);
                can(Action.Update, bill_schema_1.Bill);
                can(Action.Manage, store_schema_1.Store);
                can(Action.Manage, product_schema_1.Product);
                can(Action.Manage, notification_schema_1.Notification);
                break;
            case role_schema_1.RoleName.MANAGER:
                can(Action.Manage, usertoken_schema_1.UserToken);
                can(Action.Manage, notification_schema_1.Notification);
                can(Action.Read, role_schema_1.Role);
                can(Action.Manage, user_schema_1.User);
                can(Action.Manage, store_schema_1.Store);
                break;
            default:
                break;
        }
        return build({
            detectSubjectType: item => item.constructor,
        });
    }
};
exports.AbilityFactory = AbilityFactory;
exports.AbilityFactory = AbilityFactory = __decorate([
    (0, common_1.Injectable)()
], AbilityFactory);


/***/ }),
/* 36 */
/***/ ((module) => {

"use strict";
module.exports = require("@casl/ability");

/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckRole = exports.CHECK_ROLE = void 0;
const common_1 = __webpack_require__(6);
exports.CHECK_ROLE = 'check_role';
const CheckRole = (...roles) => (0, common_1.SetMetadata)(exports.CHECK_ROLE, roles);
exports.CheckRole = CheckRole;


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbilitiesGuard = void 0;
const common_1 = __webpack_require__(6);
const core_1 = __webpack_require__(4);
const ability_factory_1 = __webpack_require__(35);
const abilities_decorator_1 = __webpack_require__(15);
const ability_1 = __webpack_require__(36);
const role_service_1 = __webpack_require__(39);
const role_decorator_1 = __webpack_require__(37);
let AbilitiesGuard = class AbilitiesGuard {
    constructor(reflector, caslAbilityFactory, roleService) {
        this.reflector = reflector;
        this.caslAbilityFactory = caslAbilityFactory;
        this.roleService = roleService;
    }
    initialize(param) {
        this.param = param;
    }
    async canActivate(context) {
        const checkRoles = this.reflector.get(role_decorator_1.CHECK_ROLE, context.getHandler()) || [];
        const rules = this.reflector.get(abilities_decorator_1.CHECK_ABILITY, context.getHandler()) || [];
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userId = user.userId;
        const roles = user.role || await this.roleService.getRoleNameByUserId(userId);
        var currentRole = "";
        checkRoles.forEach(role => {
            if ((roles.includes(role))) {
                currentRole = role;
            }
        });
        if (currentRole === "") {
            currentRole = roles.split(" - ")[0];
        }
        const ability = this.caslAbilityFactory.defineAbility(currentRole);
        try {
            rules.forEach(rule => {
                ability_1.ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
            });
            return true;
        }
        catch (error) {
            if (error instanceof ability_1.ForbiddenError) {
                throw new common_1.ForbiddenException(error.message);
            }
        }
    }
};
exports.AbilitiesGuard = AbilitiesGuard;
exports.AbilitiesGuard = AbilitiesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, typeof (_b = typeof ability_factory_1.AbilityFactory !== "undefined" && ability_factory_1.AbilityFactory) === "function" ? _b : Object, typeof (_c = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _c : Object])
], AbilitiesGuard);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
const role_schema_1 = __webpack_require__(34);
let RoleService = class RoleService {
    constructor(roleModel) {
        this.roleModel = roleModel;
    }
    async create(role) {
        try {
            const newRole = await this.roleModel.create(role);
            return newRole;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async addUserToRole(userId, roleName) {
        try {
            const role = await this.getByName(roleName.name);
            if (!role) {
                return false;
            }
            const roleNames = await this.getRoleNameByUserId(userId);
            if (!roleNames) {
                return await this.addUserIntoListUser(role._id, userId);
            }
            if (roleNames.includes(role_schema_1.RoleName.USER) && roleName.name == role_schema_1.RoleName.SELLER) {
                return await this.addUserIntoListUser(role._id, userId);
            }
            else {
                return false;
            }
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getByName(roleName) {
        try {
            const role = await this.roleModel.findOne({ name: roleName });
            return role;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async addUserIntoListUser(roleId, userId) {
        try {
            const result = await this.roleModel.findByIdAndUpdate(roleId, { $push: { listUser: userId } });
            if (!result) {
                return false;
            }
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async removeUserRole(userId, name) {
        try {
            const role = await this.roleModel.findOne({ name, listUser: userId });
            if (!role) {
                return false;
            }
            const result = await this.roleModel.findByIdAndUpdate(role._id, { $pull: { listUser: userId } });
            if (!result)
                return false;
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getRoleNameByUserId(userId) {
        try {
            const role = await this.roleModel.find({ listUser: userId });
            if (!role) {
                return '';
            }
            const roleName = role.map(role => role.name).join(' - ');
            return roleName;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getByUserId(userId) {
        try {
            const role = await this.roleModel.findOne({ listUser: userId });
            return role;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], RoleService);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InternalServerErrorExceptionCustom = void 0;
const common_1 = __webpack_require__(6);
class InternalServerErrorExceptionCustom extends common_1.HttpException {
    constructor() {
        super("Lỗi hệ thống, vui lòng quay lại sau giây lát...", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.InternalServerErrorExceptionCustom = InternalServerErrorExceptionCustom;


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InternalServerErrorException = exports.ConflictException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = void 0;
const common_1 = __webpack_require__(6);
class BadRequestException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.BAD_REQUEST);
        this.name = 'BadRequestException';
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.UNAUTHORIZED);
        this.name = 'UnauthorizedException';
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.FORBIDDEN);
        this.name = 'ForbiddenException';
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.NOT_FOUND);
        this.name = 'NotFoundException';
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends common_1.HttpException {
    constructor(message, rootError) {
        super({ message, rootError }, common_1.HttpStatus.CONFLICT);
        this.name = 'ConflictException';
    }
}
exports.ConflictException = ConflictException;
class InternalServerErrorException extends common_1.HttpException {
    constructor(message, rootError) {
        if (rootError && rootError instanceof common_1.HttpException) {
            super(rootError.getResponse(), rootError.getStatus());
            this.name = rootError.name;
        }
        else {
            super({ message, rootError }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            this.name = 'InternalServerErrorException';
        }
    }
}
exports.InternalServerErrorException = InternalServerErrorException;


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Created = exports.OK = exports.SuccessResponse = exports.ReasonPhrase = exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["ACCEPTED"] = 202] = "ACCEPTED";
    StatusCode[StatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusCode[StatusCode["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    StatusCode[StatusCode["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    StatusCode[StatusCode["ALREADY_REPORTED"] = 208] = "ALREADY_REPORTED";
    StatusCode[StatusCode["IM_USED"] = 226] = "IM_USED";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
var ReasonPhrase;
(function (ReasonPhrase) {
    ReasonPhrase["OK"] = "OK";
    ReasonPhrase["CREATED"] = "Created";
    ReasonPhrase["ACCEPTED"] = "Accepted";
    ReasonPhrase["NO_CONTENT"] = "No Content";
    ReasonPhrase["PARTIAL_CONTENT"] = "Partial Content";
    ReasonPhrase["MULTI_STATUS"] = "Multi-Status";
    ReasonPhrase["ALREADY_REPORTED"] = "Already Reported";
    ReasonPhrase["IM_USED"] = "IM Used";
})(ReasonPhrase || (exports.ReasonPhrase = ReasonPhrase = {}));
class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonPhrase = ReasonPhrase.OK, metadata = {}, }) {
        this.message = !message ? reasonPhrase : message;
        this.status = statusCode;
        this.metadata = metadata;
    }
}
exports.SuccessResponse = SuccessResponse;
class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}
exports.OK = OK;
class Created extends SuccessResponse {
    constructor({ options = {}, message, statusCode = StatusCode.CREATED, reasonPhrase = ReasonPhrase.CREATED, metadata, }) {
        super({ message, statusCode, reasonPhrase, metadata });
        this.options = options;
    }
}
exports.Created = Created;


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EvaluationService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const evaluation_schema_1 = __webpack_require__(24);
const mongoose_2 = __webpack_require__(18);
const evaluation_dto_1 = __webpack_require__(44);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let EvaluationService = class EvaluationService {
    constructor(evaluationModel) {
        this.evaluationModel = evaluationModel;
    }
    async create(productId) {
        try {
            const newEvaluation = await this.evaluationModel.create({ productId });
            return newEvaluation;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(userId, productId, name) {
        const evaluation = await this.evaluationModel.findOne({ productId });
        if (!evaluation) {
            return false;
        }
        const index = evaluation.hadEvaluation.findIndex(had => had.userId.toString() === userId.toString());
        const newHadEvaluation = new evaluation_dto_1.HadEvaluation();
        newHadEvaluation.userId = userId;
        newHadEvaluation.isHad = true;
        if (index == -1) {
            evaluation.hadEvaluation.push(newHadEvaluation);
        }
        return await this.updateEmoji(userId, name, evaluation);
    }
    async updateEmoji(userId, name, evaluation) {
        try {
            const index = evaluation.emojis.findIndex(emoji => emoji.userId.toString() === userId.toString());
            const newEmoji = new evaluation_dto_1.EmojiDto();
            newEmoji.userId = userId;
            newEmoji.name = name;
            if (index == -1) {
                evaluation.emojis.push(newEmoji);
            }
            else {
                if (evaluation.emojis[index].name == name) {
                    evaluation.emojis.splice(index, 1);
                }
                else {
                    evaluation.emojis[index] = newEmoji;
                }
            }
            await evaluation.save();
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getByProductId(productId) {
        try {
            const evaluation = await this.evaluationModel.findOne({ productId });
            if (!evaluation) {
                return null;
            }
            return evaluation;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async checkEvaluationByUserIdAndProductId(userId, productId) {
        try {
            const evaluation = await this.evaluationModel.findOne({ productId, 'hadEvaluation.userId': userId, 'hadEvaluation.isHad': true });
            return evaluation ? true : false;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.EvaluationService = EvaluationService;
exports.EvaluationService = EvaluationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(evaluation_schema_1.Evaluation.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], EvaluationService);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HadEvaluation = exports.EmojiDto = void 0;
const class_validator_1 = __webpack_require__(20);
class EmojiDto {
}
exports.EmojiDto = EmojiDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmojiDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmojiDto.prototype, "name", void 0);
class HadEvaluation {
}
exports.HadEvaluation = HadEvaluation;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HadEvaluation.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], HadEvaluation.prototype, "isHad", void 0);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
const sortByContitions_1 = __webpack_require__(46);
const product_schema_1 = __webpack_require__(28);
let ProductService = class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(storeId, product) {
        try {
            const newProduct = await this.productModel.create(product);
            newProduct.storeId = storeId;
            await newProduct.save();
            return newProduct;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getById(id) {
        try {
            const product = await this.productModel.findOne({ _id: id });
            return product;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllBySearch(storeIdInput, pageQuery, limitQuery, searchQuery, sortTypeQuery = 'desc', sortValueQuery = 'productName', status) {
        const storeId = storeIdInput ? { storeId: storeIdInput } : {};
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const search = searchQuery
            ? {
                $or: [
                    { productName: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { keywords: { $regex: searchQuery, $options: 'i' } },
                    { type: { $regex: searchQuery, $options: 'i' } },
                    { storeName: { $regex: searchQuery, $options: 'i' } },
                    { categoryId: { $regex: searchQuery, $options: 'i' } },
                ],
            }
            : {};
        const skip = limit * (page - 1);
        try {
            const total = await this.productModel.countDocuments({ ...search, ...storeId, ...status });
            const products = await this.productModel
                .find({ ...search, ...storeId, ...status })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip);
            (0, sortByContitions_1.default)(products, sortTypeQuery, sortValueQuery);
            return { total, products };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, product) {
        try {
            const updatedProduct = await this.productModel.findByIdAndUpdate({ _id: id }, { ...product }, { new: true });
            if (product.quantity === 0) {
                updatedProduct.status = false;
                await updatedProduct.save();
            }
            return updatedProduct;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async deleteProduct(productId) {
        try {
            const product = await this.productModel.findByIdAndDelete(productId);
            return product;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getListProductLasted(limit) {
        try {
            const products = await this.productModel.find({ status: true }).sort({ createdAt: -1 }).limit(limit);
            return products;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateQuantity(id, quantitySold) {
        try {
            const product = await this.getById(id);
            product.quantity -= quantitySold;
            if (product.quantity === 0) {
                product.status = false;
            }
            await product.save();
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getRandomProducts(limit = 5, excludeIdsBody, cursor) {
        try {
            const excludeIds = excludeIdsBody.ids.map(id => new mongoose_2.Types.ObjectId(id));
            let query = {};
            if (cursor.date)
                query = { createdAt: { $gt: new Date(cursor.date) } };
            const products = await this.productModel.aggregate([
                {
                    $match: {
                        ...query,
                        _id: { $nin: excludeIds },
                        status: true,
                    },
                },
                { $sample: { size: Number(limit) } },
            ]);
            const remainingLimit = limit - products.length;
            if (remainingLimit < limit) {
                const currentExcludeIds = products.map(product => product._id);
                excludeIds.push(...currentExcludeIds);
                const otherProducts = await this.productModel.aggregate([
                    {
                        $match: {
                            _id: { $nin: excludeIds },
                            status: true,
                        },
                    },
                    { $sample: { size: remainingLimit } },
                ]);
                products.push(...otherProducts);
            }
            return products;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllBySearchAndFilter(pageQuery = 1, limitQuery = 5, searchQuery, filterQuery) {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const skip = limit * (page - 1);
        try {
            let query = {};
            if (searchQuery) {
                query.$or = [
                    { productName: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { keywords: { $regex: searchQuery, $options: 'i' } },
                    { type: { $regex: searchQuery, $options: 'i' } },
                    { storeName: { $regex: searchQuery, $options: 'i' } },
                    { categoryId: { $regex: searchQuery, $options: 'i' } },
                ];
            }
            if (filterQuery) {
                query = { ...query, ...this.buildFilterQuery(filterQuery) };
            }
            const total = await this.productModel.countDocuments(query);
            const products = await this.productModel.find(query).sort({ price: 1, quantity: 1, createdAt: -1 }).limit(limit).skip(skip);
            return { total, products };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError) {
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }
    buildFilterQuery(filterQuery) {
        const filter = {};
        if (filterQuery.priceMin && filterQuery.priceMax) {
            filter['price'] = { $gte: Number(filterQuery.priceMin), $lte: Number(filterQuery.priceMax) };
        }
        if (filterQuery.quantityMin && filterQuery.quantityMax) {
            filter['quantity'] = { $gte: Number(filterQuery.quantityMin), $lte: Number(filterQuery.quantityMax) };
        }
        if (filterQuery.createdAtMin && filterQuery.createdAtMax) {
            filter['createdAt'] = { $gte: new Date(filterQuery.createdAtMin), $lte: new Date(filterQuery.createdAtMax) };
        }
        return filter;
    }
    async getProductsByStoreId(storeId) {
        try {
            const products = await this.productModel.find({ storeId });
            return products;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async deleteProductByCategory(categoryId) {
        try {
            await this.productModel.deleteMany({ categoryId });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getListStoreHaveMostProducts(limit = 5) {
        try {
            const products = await this.productModel.aggregate([
                {
                    $group: {
                        _id: '$storeId',
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { count: -1 },
                },
                {
                    $limit: limit,
                },
            ]);
            return products;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ProductService);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const removeVietNameseTones_1 = __webpack_require__(47);
function sortByConditions(entire, sortTypeQuery, sortValueQuery) {
    sortTypeQuery === 'asc' &&
        entire.sort((a, b) => {
            if ((0, removeVietNameseTones_1.default)(a[`${sortValueQuery}`].toString()).toUpperCase() > (0, removeVietNameseTones_1.default)(b[`${sortValueQuery}`].toString()).toUpperCase())
                return -1;
            if ((0, removeVietNameseTones_1.default)(a[`${sortValueQuery}`].toString()).toUpperCase() < (0, removeVietNameseTones_1.default)(b[`${sortValueQuery}`].toString()).toUpperCase())
                return 1;
            return 0;
        });
    sortTypeQuery === 'desc' &&
        entire.sort((a, b) => {
            if ((0, removeVietNameseTones_1.default)(a[`${sortValueQuery}`].toString()).toUpperCase() < (0, removeVietNameseTones_1.default)(b[`${sortValueQuery}`].toString()).toUpperCase())
                return -1;
            if ((0, removeVietNameseTones_1.default)(a[`${sortValueQuery}`].toString()).toUpperCase() > (0, removeVietNameseTones_1.default)(b[`${sortValueQuery}`].toString()).toUpperCase())
                return 1;
            return 0;
        });
}
exports["default"] = sortByConditions;


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    str = str.replace(/\s/g, "");
    str = str.trim();
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}
exports["default"] = removeVietnameseTones;


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the error', type: String }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The HTTP status code of the error response', type: Number }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The error message', type: String }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The stack trace (only in non-production environments)', type: String }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "stack", void 0);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SuccessResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class SuccessResponseDto {
}
exports.SuccessResponseDto = SuccessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'A message describing the success response', type: String }),
    __metadata("design:type", String)
], SuccessResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The HTTP status code of the success response', type: Number }),
    __metadata("design:type", Number)
], SuccessResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata for the success response', type: Object }),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], SuccessResponseDto.prototype, "metadata", void 0);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoreService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
const store_schema_1 = __webpack_require__(30);
let StoreService = class StoreService {
    constructor(storeModel) {
        this.storeModel = storeModel;
    }
    async create(userId, store) {
        try {
            const newStore = await this.storeModel.create(store);
            newStore.userId = userId;
            await newStore.save();
            return newStore;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getById(id) {
        try {
            return await this.storeModel.findOne({ _id: id.toString() });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getByUserId(userId) {
        try {
            return await this.storeModel.findOne({ userId });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(userId, store) {
        try {
            return await this.storeModel.findOneAndUpdate({ userId }, store, { new: true });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateWarningCount(storeId, action) {
        try {
            let point = 1;
            if (action === 'minus')
                point = -1;
            return await this.storeModel.findByIdAndUpdate(storeId, { $inc: { warningCount: point } });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async delete(userId) {
        try {
            return await this.storeModel.findOneAndDelete({ userId });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(store_schema_1.Store.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], StoreService);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
const update_user_dto_1 = __webpack_require__(52);
const user_schema_1 = __webpack_require__(31);
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(signUpDto) {
        try {
            const newUser = await this.userModel.create(signUpDto);
            await newUser.save();
            const userDoc = newUser['_doc'];
            const { password, ...userWithoutPass } = userDoc;
            return userWithoutPass;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getByEmail(email) {
        try {
            const user = await this.userModel.findOne({ email });
            user?.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1));
            return user;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getById(userId) {
        try {
            const user = await this.userModel.findById(userId);
            user?.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1));
            return user;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(userId, req) {
        try {
            const user = await this.userModel.findByIdAndUpdate(userId, req, { new: true });
            return user;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async delete(userId) {
        try {
            const user = await this.userModel.findByIdAndDelete(userId);
            return user;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async followStore(userId, storeId) {
        try {
            const user = await this.userModel.findById(userId);
            const index = user.followStores.findIndex(id => id.toString() === storeId.toString());
            index == -1 ? user.followStores.push(storeId) : user.followStores.splice(index, 1);
            await user.save();
            return;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async addFriend(userIdSend, userIdReceive) {
        try {
            const user = await this.userModel.findById(userIdSend);
            const index = user.friends.findIndex(id => id.toString() === userIdReceive.toString());
            index == -1 ? user.friends.push(userIdReceive) : user.friends.splice(index, 1);
            await user.save();
            return;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateWallet(userId, money, type) {
        try {
            const user = await this.getById(userId);
            const bonus = (money * 0.2) / 1000;
            const updateUser = new update_user_dto_1.UpdateUserDto();
            updateUser.wallet = type == 'plus' ? user.wallet + bonus : user.wallet - bonus;
            await this.update(userId, updateUser);
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateWarningCount(userId, action) {
        try {
            let point = 1;
            if (action === 'minus')
                point = -1;
            const user = await this.userModel.findByIdAndUpdate(userId, { $inc: { warningCount: point } });
            return user;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAll(page, limit, search) {
        try {
            const total = await this.userModel.countDocuments({
                $or: [{ email: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }],
            });
            const users = await this.userModel
                .find({ $or: [{ email: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
            users.map(user => {
                user?.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1));
                return user;
            });
            return { total, users };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updatePassword(email, password) {
        try {
            return await this.userModel.findOneAndUpdate({ email }, { password });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getFollowStoresByStoreId(storeId) {
        try {
            return await this.userModel.find({ followStores: storeId });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countTotalFollowStoresByStoreId(storeId) {
        try {
            return await this.userModel.countDocuments({ followStores: storeId });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UserService);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
const address_profile_dto_1 = __webpack_require__(53);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [address_profile_dto_1.AddressProfileDto] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UpdateUserDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "wallet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "status", void 0);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddressProfileDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class AddressProfileDto {
    constructor() {
        this.default = false;
    }
}
exports.AddressProfileDto = AddressProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressProfileDto.prototype, "receiverName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressProfileDto.prototype, "receiverPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddressProfileDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], AddressProfileDto.prototype, "default", void 0);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsertokenService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const usertoken_schema_1 = __webpack_require__(33);
const mongoose_2 = __webpack_require__(18);
const bcrypt = __webpack_require__(11);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let UsertokenService = class UsertokenService {
    constructor(userTokenModel) {
        this.userTokenModel = userTokenModel;
    }
    async hashData(data) {
        const saltOrRounds = Number(process.env.SALT_ROUNDS);
        return await bcrypt.hash(data, saltOrRounds);
    }
    async createUserToken(userId, refreshToken) {
        const hashedRT = await this.hashData(refreshToken);
        try {
            const userToken = await this.userTokenModel.create({
                userId,
                hashedRefreshToken: hashedRT,
            });
            return userToken;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateUserToken(userId, refreshToken) {
        try {
            const hashedRT = await this.hashData(refreshToken);
            const userToken = await this.userTokenModel.findOneAndUpdate({ userId }, { hashedRefreshToken: hashedRT }, { new: true });
            if (!userToken) {
                return false;
            }
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async deleteUserToken(userId) {
        try {
            const userToken = await this.userTokenModel.findOneAndDelete({ userId });
            if (!userToken) {
                return false;
            }
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getUserTokenById(userId) {
        try {
            const userToken = await this.userTokenModel.findOne({ userId });
            return userToken;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.UsertokenService = UsertokenService;
exports.UsertokenService = UsertokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usertoken_schema_1.UserToken.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UsertokenService);


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetCurrentUserId = void 0;
const common_1 = __webpack_require__(6);
exports.GetCurrentUserId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user['userId'];
});


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Public = void 0;
const common_1 = __webpack_require__(6);
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)({}, { message: "Email is invalid" }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedDto = exports.SeedProductDto = exports.SeedStoreDto = exports.SeedUserDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_transformer_1 = __webpack_require__(59);
const class_validator_1 = __webpack_require__(20);
class SeedUserDto {
}
exports.SeedUserDto = SeedUserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email is invalid' }),
    __metadata("design:type", String)
], SeedUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], SeedUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)('VN'),
    (0, class_validator_1.Length)(10),
    __metadata("design:type", String)
], SeedUserDto.prototype, "phone", void 0);
class SeedStoreDto {
}
exports.SeedStoreDto = SeedStoreDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedStoreDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedStoreDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedStoreDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedStoreDto.prototype, "address", void 0);
class SeedProductDto {
}
exports.SeedProductDto = SeedProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], SeedProductDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SeedProductDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedProductDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SeedProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], SeedProductDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SeedProductDto.prototype, "storeId", void 0);
class SeedDto {
}
exports.SeedDto = SeedDto;
__decorate([
    (0, class_transformer_1.Type)(() => SeedUserDto),
    (0, swagger_1.ApiProperty)({ type: [SeedUserDto] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], SeedDto.prototype, "users", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => SeedStoreDto),
    (0, swagger_1.ApiProperty)({ type: [SeedStoreDto] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], SeedDto.prototype, "stores", void 0);


/***/ }),
/* 59 */
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");

/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignUpDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class SignUpDto {
}
exports.SignUpDto = SignUpDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignUpDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email is invalid' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], SignUpDto.prototype, "password", void 0);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtRTAuthGuard = void 0;
const common_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(62);
let JwtRTAuthGuard = class JwtRTAuthGuard extends (0, passport_1.AuthGuard)('jwt-refresh') {
};
exports.JwtRTAuthGuard = JwtRTAuthGuard;
exports.JwtRTAuthGuard = JwtRTAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtRTAuthGuard);


/***/ }),
/* 62 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const bill_module_1 = __webpack_require__(65);
const role_module_1 = __webpack_require__(71);
const HasPermitRole_middleware_1 = __webpack_require__(103);
const HasSameRoleUser_middleware_1 = __webpack_require__(104);
const user_schema_1 = __webpack_require__(31);
const user_controller_1 = __webpack_require__(105);
const user_service_1 = __webpack_require__(51);
const store_module_1 = __webpack_require__(82);
let UserModule = class UserModule {
    configure(consumer) {
        consumer
            .apply(HasPermitRole_middleware_1.HasPermitRoleMiddleware)
            .forRoutes({ path: 'user/user/:id', method: common_1.RequestMethod.GET }, { path: 'user/user/:id', method: common_1.RequestMethod.PUT }, { path: 'user/user/:id', method: common_1.RequestMethod.DELETE });
        consumer
            .apply(HasSameRoleUser_middleware_1.HasSameRoleUserMiddleware)
            .forRoutes({ path: 'user/user/addFriend/:id', method: common_1.RequestMethod.POST }, { path: 'user/user/unFriend/:id', method: common_1.RequestMethod.POST });
    }
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: user_schema_1.UserSchema }]), ability_module_1.AbilityModule, role_module_1.RoleModule, bill_module_1.BillModule, store_module_1.StoreModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbilityModule = void 0;
const common_1 = __webpack_require__(6);
const ability_factory_1 = __webpack_require__(35);
let AbilityModule = class AbilityModule {
};
exports.AbilityModule = AbilityModule;
exports.AbilityModule = AbilityModule = __decorate([
    (0, common_1.Module)({
        providers: [ability_factory_1.AbilityFactory],
        exports: [ability_factory_1.AbilityFactory],
    })
], AbilityModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillModule = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const cart_module_1 = __webpack_require__(66);
const product_module_1 = __webpack_require__(74);
const role_module_1 = __webpack_require__(71);
const store_module_1 = __webpack_require__(82);
const user_module_1 = __webpack_require__(63);
const bill_controller_1 = __webpack_require__(100);
const bill_service_1 = __webpack_require__(76);
const payment_module_1 = __webpack_require__(102);
const bill_schema_1 = __webpack_require__(16);
let BillModule = class BillModule {
};
exports.BillModule = BillModule;
exports.BillModule = BillModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Bill', schema: bill_schema_1.BillSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            payment_module_1.PaymentModule,
            cart_module_1.CartModule,
            product_module_1.ProductModule,
            store_module_1.StoreModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
        ],
        controllers: [bill_controller_1.BillController],
        providers: [bill_service_1.BillService],
        exports: [bill_service_1.BillService],
    })
], BillModule);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartModule = void 0;
const common_1 = __webpack_require__(6);
const cart_service_1 = __webpack_require__(67);
const cart_controller_1 = __webpack_require__(70);
const mongoose_1 = __webpack_require__(17);
const cart_schema_1 = __webpack_require__(22);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const product_module_1 = __webpack_require__(74);
const store_module_1 = __webpack_require__(82);
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Cart', schema: cart_schema_1.CartSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            product_module_1.ProductModule,
            store_module_1.StoreModule,
        ],
        controllers: [cart_controller_1.CartController],
        providers: [cart_service_1.CartService],
        exports: [cart_service_1.CartService],
    })
], CartModule);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const product_bill_dto_1 = __webpack_require__(68);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
const cart_create_dto_1 = __webpack_require__(69);
const cart_schema_1 = __webpack_require__(22);
let CartService = class CartService {
    constructor(cartModel) {
        this.cartModel = cartModel;
    }
    getTotalPrice(listProducts) {
        const totalPrice = listProducts.reduce((total, product) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0);
        return totalPrice;
    }
    async create(userId, store, product) {
        try {
            const cart = new cart_create_dto_1.CreateCartDto();
            cart.userId = userId;
            cart.storeId = product.storeId;
            cart.storeAvatar = store.avatar;
            cart.storeName = store.name;
            const productInfo = new product_bill_dto_1.ProductBillDto();
            productInfo.avatar = product.avatar;
            productInfo.productId = product._id;
            productInfo.productName = product.productName;
            productInfo.quantity = 1;
            productInfo.price = product.price;
            productInfo.quantityInStock = product.quantity;
            cart.listProducts = [productInfo];
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            const newCart = await this.cartModel.create(cart);
            return newCart;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByUserId(userId) {
        try {
            const carts = await this.cartModel.find({ userId }).sort({ createdAt: -1 });
            return carts;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(product, cart) {
        try {
            const productInfo = new product_bill_dto_1.ProductBillDto();
            productInfo.avatar = product.avatar;
            productInfo.productId = product._id;
            productInfo.productName = product.productName;
            productInfo.quantity = 1;
            productInfo.price = product.price;
            productInfo.quantityInStock = product.quantity;
            cart.listProducts.push(productInfo);
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            await cart.save();
            return cart;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async updateQuantity(product, cart) {
        try {
            cart.listProducts.map(productCart => {
                if (productCart.productId.toString() === product._id.toString()) {
                    productCart.quantity++;
                }
                return productCart;
            });
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            return await this.cartModel.findByIdAndUpdate(cart._id, cart);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async addProductIntoCart(userId, store, product) {
        const allCart = await this.getAllByUserId(userId);
        if (!allCart) {
            const newCart = await this.create(userId, store, product);
            return newCart;
        }
        else {
            const cart = allCart.find(cart => cart.storeId.toString() === product.storeId.toString());
            if (!cart) {
                const newCart = await this.create(userId, store, product);
                return newCart;
            }
            else {
                const hasProduct = cart.listProducts.find(productCart => productCart.productId.toString() === product._id.toString());
                const updatedCart = hasProduct ? await this.updateQuantity(product, cart) : await this.update(product, cart);
                return updatedCart;
            }
        }
    }
    async getByUserId(userId, pageQuery, limitQuery, searchQuery) {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const search = searchQuery
            ? {
                $or: [
                    { storeName: { $regex: searchQuery, $options: 'i' } },
                    { listProducts: { $elemMatch: { productName: { $regex: searchQuery, $options: 'i' } } } },
                ],
            }
            : {};
        const skip = limit * (page - 1);
        try {
            const total = await this.cartModel.countDocuments({ ...search, userId });
            const carts = await this.cartModel
                .find({ ...search, userId })
                .sort({ updatedAt: -1 })
                .limit(limit)
                .skip(skip);
            return { total, carts };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async removeProductInCart(userId, productId, storeId) {
        try {
            const cart = await this.cartModel.findOne({ userId, storeId });
            if (cart.listProducts.length === 1) {
                await this.cartModel.findByIdAndDelete(cart._id);
                return;
            }
            const index = cart.listProducts.findIndex(product => product.productId.toString() === productId.toString());
            cart.listProducts.splice(index, 1);
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            await cart.save();
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async removeMultiProductInCart(userId, listProduct, storeId) {
        try {
            const cart = await this.cartModel.findOne({ userId, storeId });
            listProduct.forEach(product => {
                const index = cart.listProducts.findIndex(productCart => productCart.productId.toString() === product.productId.toString());
                cart.listProducts.splice(index, 1);
            });
            if (cart.listProducts.length === 0) {
                await this.cartModel.findByIdAndDelete(cart._id);
                return;
            }
            cart.totalPrice = this.getTotalPrice(cart.listProducts);
            await cart.save();
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CartService);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductBillDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class ProductBillDto {
}
exports.ProductBillDto = ProductBillDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ProductBillDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductBillDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductBillDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductBillDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductBillDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductBillDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductBillDto.prototype, "quantityInStock", void 0);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCartDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreateCartDto {
}
exports.CreateCartDto = CreateCartDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "storeAvatar", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "storeName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateCartDto.prototype, "listProducts", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateCartDto.prototype, "totalPrice", void 0);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const get_current_userid_decorator_1 = __webpack_require__(55);
const error_response_1 = __webpack_require__(41);
const success_response_1 = __webpack_require__(42);
const product_service_1 = __webpack_require__(45);
const role_schema_1 = __webpack_require__(34);
const store_service_1 = __webpack_require__(50);
const cart_service_1 = __webpack_require__(67);
let CartController = class CartController {
    constructor(cartService, productService, storeService) {
        this.cartService = cartService;
        this.productService = productService;
        this.storeService = storeService;
    }
    async processCart(productId, userId) {
        const product = await this.productService.getById(productId);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const store = await this.storeService.getById(product.storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const result = await this.cartService.addProductIntoCart(userId, store, product);
        if (!result)
            return new error_response_1.InternalServerErrorException('Không thêm sản phẩm vào giỏ hàng được!');
        return new success_response_1.SuccessResponse({
            message: 'Thêm sản phẩm vào giỏ hàng thành công!',
            metadata: { data: result },
        });
    }
    async getByUserId(page, limit, search, userId) {
        const data = await this.cartService.getByUserId(userId, page, limit, search);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách giỏ hàng thành công!',
            metadata: { data },
        });
    }
    async getAllByUserId(userId) {
        const data = await this.cartService.getAllByUserId(userId);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách giỏ hàng thành công!',
            metadata: { data },
        });
    }
    async removeProductInCart(productId, userId) {
        const product = await this.productService.getById(productId);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const store = await this.storeService.getById(product.storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        await this.cartService.removeProductInCart(userId, productId, store._id);
        return new success_response_1.SuccessResponse({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công!',
            metadata: {},
        });
    }
    async getNewCartByUserId(userId) {
        const carts = await this.cartService.getAllByUserId(userId);
        const data = carts[0];
        return new success_response_1.SuccessResponse({
            message: 'Lấy giỏ hàng mới nhất thành công!',
            metadata: { data },
        });
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], CartController.prototype, "processCart", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], CartController.prototype, "getByUserId", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('/get-all'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], CartController.prototype, "getAllByUserId", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], CartController.prototype, "removeProductInCart", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadCartAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('/get-new'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], CartController.prototype, "getNewCartByUserId", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart/user'),
    (0, swagger_1.ApiTags)('Cart'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof cart_service_1.CartService !== "undefined" && cart_service_1.CartService) === "function" ? _a : Object, typeof (_b = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _b : Object, typeof (_c = typeof store_service_1.StoreService !== "undefined" && store_service_1.StoreService) === "function" ? _c : Object])
], CartController);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleModule = void 0;
const common_1 = __webpack_require__(6);
const role_service_1 = __webpack_require__(39);
const role_controller_1 = __webpack_require__(72);
const mongoose_1 = __webpack_require__(17);
const role_schema_1 = __webpack_require__(34);
const ability_module_1 = __webpack_require__(64);
let RoleModule = class RoleModule {
};
exports.RoleModule = RoleModule;
exports.RoleModule = RoleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Role', schema: role_schema_1.RoleSchema }]),
            ability_module_1.AbilityModule,
        ],
        controllers: [role_controller_1.RoleController],
        providers: [role_service_1.RoleService],
        exports: [role_service_1.RoleService],
    })
], RoleModule);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleController = void 0;
const common_1 = __webpack_require__(6);
const role_service_1 = __webpack_require__(39);
const create_role_dto_1 = __webpack_require__(73);
const swagger_1 = __webpack_require__(13);
const role_schema_1 = __webpack_require__(34);
const abilities_decorator_1 = __webpack_require__(15);
const abilities_guard_1 = __webpack_require__(38);
const role_decorator_1 = __webpack_require__(37);
const success_response_1 = __webpack_require__(42);
const error_response_1 = __webpack_require__(41);
let RoleController = class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async addUserToRole(userId, roleName) {
        const result = await this.roleService.addUserToRole(userId, roleName);
        if (!result)
            return new error_response_1.BadRequestException("Thêm quyền thất bại!");
        return new success_response_1.SuccessResponse({
            message: "Thêm quyền thành công!",
            metadata: { data: result },
        });
    }
    async removeUserRole(userId, roleName) {
        const result = await this.roleService.removeUserRole(userId, roleName);
        if (!result)
            return new error_response_1.NotFoundException("Không tìm thấy quyền này!");
        return new success_response_1.SuccessResponse({
            message: "Xóa quyền thành công!",
            metadata: { data: result },
        });
    }
    async getRoleNameByUserId(userId) {
        const role = await this.roleService.getRoleNameByUserId(userId);
        if (!role)
            return new error_response_1.NotFoundException("Không tìm thấy quyền này!");
        return new success_response_1.SuccessResponse({
            message: "Lấy quyền thành công!",
            metadata: { data: role },
        });
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateRoleAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Post)('addUserToRole'),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: true }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof create_role_dto_1.CreateRoleDto !== "undefined" && create_role_dto_1.CreateRoleDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], RoleController.prototype, "addUserToRole", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateRoleAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)('removeUserRole'),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'roleName', type: String, required: true }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('roleName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], RoleController.prototype, "removeUserRole", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadRoleAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN, role_schema_1.RoleName.MANAGER),
    (0, common_1.Get)('getRoleNameByUserId'),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: true }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], RoleController.prototype, "getRoleNameByUserId", null);
exports.RoleController = RoleController = __decorate([
    (0, common_1.Controller)('role/admin'),
    (0, swagger_1.ApiTags)('Role'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _a : Object])
], RoleController);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateRoleDto = void 0;
const swagger_1 = __webpack_require__(13);
const role_schema_1 = __webpack_require__(34);
class CreateRoleDto {
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_a = typeof role_schema_1.RoleName !== "undefined" && role_schema_1.RoleName) === "function" ? _a : Object)
], CreateRoleDto.prototype, "name", void 0);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductModule = void 0;
const common_1 = __webpack_require__(6);
const product_service_1 = __webpack_require__(45);
const product_controller_1 = __webpack_require__(75);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const product_schema_1 = __webpack_require__(28);
const store_module_1 = __webpack_require__(82);
const evaluation_module_1 = __webpack_require__(90);
const user_module_1 = __webpack_require__(63);
const notification_module_1 = __webpack_require__(93);
const bill_module_1 = __webpack_require__(65);
const category_module_1 = __webpack_require__(97);
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Product', schema: product_schema_1.ProductSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            notification_module_1.NotificationModule,
            category_module_1.CategoryModule,
            (0, common_1.forwardRef)(() => bill_module_1.BillModule),
            evaluation_module_1.EvaluationModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => store_module_1.StoreModule),
        ],
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService],
        exports: [product_service_1.ProductService]
    })
], ProductModule);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const get_current_userid_decorator_1 = __webpack_require__(55);
const public_decorator_1 = __webpack_require__(56);
const bill_service_1 = __webpack_require__(76);
const bill_schema_1 = __webpack_require__(16);
const category_service_1 = __webpack_require__(77);
const error_response_1 = __webpack_require__(41);
const success_response_1 = __webpack_require__(42);
const evaluation_service_1 = __webpack_require__(43);
const notification_service_1 = __webpack_require__(78);
const role_schema_1 = __webpack_require__(34);
const store_service_1 = __webpack_require__(50);
const user_service_1 = __webpack_require__(51);
const create_product_dto_1 = __webpack_require__(79);
const product_dto_1 = __webpack_require__(80);
const update_product_dto_1 = __webpack_require__(81);
const product_service_1 = __webpack_require__(45);
let ProductController = class ProductController {
    constructor(productService, storeService, evaluationService, userService, notificationService, billService, categoryService) {
        this.productService = productService;
        this.storeService = storeService;
        this.evaluationService = evaluationService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.billService = billService;
        this.categoryService = categoryService;
    }
    async create(product, userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const category = await this.categoryService.getById(product.categoryId);
        if (!category)
            return new error_response_1.NotFoundException('Không tìm thấy danh mục này!');
        const newProduct = await this.productService.create(store._id, product);
        await this.evaluationService.create(newProduct._id);
        const userHasFollowStores = await this.userService.getFollowStoresByStoreId(store._id);
        const notificationPromises = [];
        for (const user of userHasFollowStores) {
            if (userId === user._id)
                continue;
            const notificationPromise = this.notificationService.create({
                userIdFrom: userId,
                userIdTo: user._id,
                content: `đã đăng sản phẩm mới. ${newProduct.productName}`,
                type: 'Thêm sản phẩm',
                sub: {
                    fullName: store.name,
                    avatar: store.avatar,
                    productId: newProduct._id.toString(),
                },
            });
            notificationPromises.push(notificationPromise);
        }
        await Promise.all(notificationPromises);
        return new success_response_1.SuccessResponse({
            message: 'Tạo sản phẩm thành công!',
            metadata: { data: newProduct },
        });
    }
    async sellerCreateMultiple(products, userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        products.forEach(async (product) => {
            const newProduct = await this.productService.create(store._id, product);
            await this.evaluationService.create(newProduct._id);
        });
    }
    async getAllBySearch(page, limit, search, sortType, sortValue, userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const products = await this.productService.getAllBySearch(store._id, page, limit, search, sortType, sortValue, {});
        const fullInfoProducts = await Promise.all(products.products.map(async (product) => {
            const category = await this.categoryService.getById(product.categoryId);
            const quantitySold = await this.billService.countProductDelivered(product._id, bill_schema_1.PRODUCT_TYPE.SELL, 'DELIVERED');
            const quantityGive = await this.billService.countProductDelivered(product._id, bill_schema_1.PRODUCT_TYPE.GIVE, 'DELIVERED');
            const revenue = quantitySold * product.price;
            const isPurchased = await this.billService.checkProductPurchased(product._id);
            return {
                ...product.toObject(),
                categoryName: category.name,
                storeName: store.name,
                quantitySold,
                quantityGive,
                revenue,
                isPurchased,
            };
        }));
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data: { total: products.total, products: fullInfoProducts } },
        });
    }
    async getAllBySearchPublic(page, limit, search) {
        const products = await this.productService.getAllBySearch(null, page, limit, search, null, null, { status: true });
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data: products },
        });
    }
    async getAllOtherProductByStoreId(storeId, productId) {
        const products = await this.productService.getProductsByStoreId(storeId);
        const relateProducts = products.filter(product => product._id.toString() !== productId).slice(0, 12);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách tất cả sản phẩm khác cùng cửa hàng thành công!',
            metadata: { total: relateProducts.length, data: relateProducts },
        });
    }
    async update(id, product) {
        const newProduct = await this.productService.update(id, product);
        if (!newProduct)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật sản phẩm thành công!',
            metadata: { data: newProduct },
        });
    }
    async getlistProductLasted(limit) {
        const data = await this.productService.getListProductLasted(Number(limit));
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data },
        });
    }
    async mostProductsInStore(limit) {
        const storeHaveMostProducts = await this.productService.getListStoreHaveMostProducts(Number(limit));
        const data = await Promise.all(storeHaveMostProducts.map(async (item) => {
            const store = await this.storeService.getById(item._id);
            if (!store)
                throw new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
            let products = await this.productService.getProductsByStoreId(item._id.toString());
            products = products.map(product => {
                product = product.toObject();
                delete product.storeId;
                delete product.status;
                delete product['createdAt'];
                delete product['updatedAt'];
                delete product.__v;
                return product;
            });
            return {
                storeId: store._id,
                storeName: store.name,
                storeAvatar: store.avatar,
                listProducts: products.slice(0, 10),
            };
        }));
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data },
        });
    }
    async getRandom(excludeIds, limit, cursor) {
        const products = await this.productService.getRandomProducts(limit, excludeIds, cursor);
        if (!products)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm!');
        const nextCursor = products.length > 0 ? products[products.length - 1]['createdAt'] : null;
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin sản phẩm thành công!',
            metadata: { nextCursor, data: products },
        });
    }
    async getAllBySearchAndFilterPublic(page, limit, search, filter) {
        const category = await this.categoryService.getById(search.toString());
        const products = await this.productService.getAllBySearchAndFilter(page, limit, search, filter);
        const data = {
            total: products.total,
            products: products.products,
            categoryName: category.name,
        };
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách sản phẩm thành công!',
            metadata: { data },
        });
    }
    async getById(id) {
        const product = await this.productService.getById(id);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const type = product.price === 0 ? bill_schema_1.PRODUCT_TYPE.GIVE : bill_schema_1.PRODUCT_TYPE.SELL;
        const quantityDelivered = await this.billService.countProductDelivered(id, type, 'DELIVERED');
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin sản phẩm thành công!',
            metadata: { data: product, quantityDelivered },
        });
    }
    async deleteProduct(id) {
        const product = await this.productService.deleteProduct(id);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        return new success_response_1.SuccessResponse({
            message: 'Xóa sản phẩm thành công!',
            metadata: { data: product },
        });
    }
    async deleteCategory(categoryId) {
        const product = await this.productService.deleteProductByCategory(categoryId);
        return new success_response_1.SuccessResponse({
            message: 'Xóa sản phẩm thành công!',
            metadata: { data: product },
        });
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Post)('product/seller'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof create_product_dto_1.CreateProductDto !== "undefined" && create_product_dto_1.CreateProductDto) === "function" ? _h : Object, String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Post)('product/sellerCreateMultiple'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], ProductController.prototype, "sellerCreateMultiple", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Get)('product/seller'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sortType', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sortValue', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sortType')),
    __param(4, (0, common_1.Query)('sortValue')),
    __param(5, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], ProductController.prototype, "getAllBySearch", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], ProductController.prototype, "getAllBySearchPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('products-other-in-store'),
    (0, swagger_1.ApiQuery)({ name: 'storeId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    __param(0, (0, common_1.Query)('storeId')),
    __param(1, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
], ProductController.prototype, "getAllOtherProductByStoreId", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Patch)('product/seller/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_p = typeof update_product_dto_1.UpdateProductDto !== "undefined" && update_product_dto_1.UpdateProductDto) === "function" ? _p : Object]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], ProductController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product/listProductLasted'),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], ProductController.prototype, "getlistProductLasted", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product/mostProductsInStore'),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
], ProductController.prototype, "mostProductsInStore", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, common_1.Post)('product/random'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof product_dto_1.ExcludeIds !== "undefined" && product_dto_1.ExcludeIds) === "function" ? _t : Object, Number, typeof (_u = typeof product_dto_1.FilterDate !== "undefined" && product_dto_1.FilterDate) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], ProductController.prototype, "getRandom", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product-filter'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, typeof (_w = typeof product_dto_1.FilterProduct !== "undefined" && product_dto_1.FilterProduct) === "function" ? _w : Object]),
    __metadata("design:returntype", typeof (_x = typeof Promise !== "undefined" && Promise) === "function" ? _x : Object)
], ProductController.prototype, "getAllBySearchAndFilterPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_y = typeof Promise !== "undefined" && Promise) === "function" ? _y : Object)
], ProductController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeleteProductAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER, role_schema_1.RoleName.SELLER),
    (0, common_1.Delete)('product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_z = typeof Promise !== "undefined" && Promise) === "function" ? _z : Object)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', type: String, required: false }),
    (0, common_1.Delete)('product'),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_0 = typeof Promise !== "undefined" && Promise) === "function" ? _0 : Object)
], ProductController.prototype, "deleteCategory", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('Product'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _a : Object, typeof (_b = typeof store_service_1.StoreService !== "undefined" && store_service_1.StoreService) === "function" ? _b : Object, typeof (_c = typeof evaluation_service_1.EvaluationService !== "undefined" && evaluation_service_1.EvaluationService) === "function" ? _c : Object, typeof (_d = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _d : Object, typeof (_e = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _e : Object, typeof (_f = typeof bill_service_1.BillService !== "undefined" && bill_service_1.BillService) === "function" ? _f : Object, typeof (_g = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _g : Object])
], ProductController);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
const bill_schema_1 = __webpack_require__(16);
let BillService = class BillService {
    constructor(billModel) {
        this.billModel = billModel;
    }
    getTotalPriceWithPromotion(listProducts, promotionValue) {
        const productPrice = listProducts.reduce((total, product) => {
            const productTotal = product.quantity * product.price;
            return total + productTotal;
        }, 0);
        const totalPrice = productPrice - promotionValue;
        return totalPrice;
    }
    async create(userId, billDto, deliveryMethod, paymentMethod, receiverInfo, giveInfo, deliveryFee) {
        try {
            billDto.listProducts.forEach((product) => {
                product.type = product.type.toUpperCase();
            });
            const billData = await this.billModel.create(billDto);
            billData.userId = userId;
            billData.deliveryMethod = deliveryMethod;
            billData.paymentMethod = paymentMethod;
            billData.receiverInfo = receiverInfo;
            if (giveInfo)
                billData.giveInfo = giveInfo;
            billData.deliveryFee = deliveryFee;
            paymentMethod === 'CASH' ? (billData.isPaid = false) : (billData.isPaid = true);
            billData.save();
            return billData;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countTotalByStatusSeller(storeId, status, year) {
        try {
            const query = { storeId, status };
            if (year) {
                query.$expr = {
                    $eq: [{ $year: '$createdAt' }, { $year: new Date(year) }],
                };
            }
            const total = await this.billModel.countDocuments({ ...query });
            return total;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countTotalByStatusUser(userId, status) {
        try {
            const query = { userId, status };
            const total = await this.billModel.countDocuments({ ...query });
            return total;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async calculateRevenueAllTime(storeId) {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ]);
            const totalRevenue = result[0]?.totalRevenue || 0;
            return totalRevenue;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async calculateRevenueByYear(storeId, year) {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                        $expr: {
                            $eq: [{ $year: '$createdAt' }, { $year: new Date(year) }],
                        },
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ]);
            const monthlyRevenue = {
                'Tháng 1': 0,
                'Tháng 2': 0,
                'Tháng 3': 0,
                'Tháng 4': 0,
                'Tháng 5': 0,
                'Tháng 6': 0,
                'Tháng 7': 0,
                'Tháng 8': 0,
                'Tháng 9': 0,
                'Tháng 10': 0,
                'Tháng 11': 0,
                'Tháng 12': 0,
            };
            let totalRevenue = 0;
            let minRevenue = null;
            let maxRevenue = null;
            result.forEach((entry) => {
                const month = entry._id;
                const revenue = entry.totalRevenue;
                monthlyRevenue[`Tháng ${month}`] = revenue;
                totalRevenue += revenue;
                if (!minRevenue || revenue < minRevenue.revenue) {
                    minRevenue = { month: `Tháng ${month}`, revenue };
                }
                if (!maxRevenue || revenue > maxRevenue.revenue) {
                    maxRevenue = { month: `Tháng ${month}`, revenue };
                }
            });
            const response = {
                data: monthlyRevenue,
                revenueTotalAllTime: await this.calculateRevenueAllTime(storeId),
                revenueTotalInYear: totalRevenue,
                minRevenue,
                maxRevenue,
            };
            return response;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countCharityAllTime(storeId) {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                    },
                },
                {
                    $unwind: '$listProducts',
                },
                {
                    $match: {
                        'listProducts.type': `${bill_schema_1.PRODUCT_TYPE.GIVE.toUpperCase()}`,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCharity: { $sum: '$listProducts.quantity' },
                    },
                },
            ]);
            const totalCharity = result[0]?.totalCharity || 0;
            return totalCharity;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countCharityByYear(storeId, year) {
        try {
            const result = await this.billModel.aggregate([
                {
                    $match: {
                        storeId: storeId.toString(),
                        $expr: {
                            $eq: [{ $year: '$createdAt' }, { $year: new Date(year) }],
                        },
                    },
                },
                {
                    $unwind: '$listProducts',
                },
                {
                    $match: {
                        'listProducts.type': `${bill_schema_1.PRODUCT_TYPE.GIVE.toUpperCase()}`,
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalCharity: { $sum: '$listProducts.quantity' },
                    },
                },
            ]);
            const monthlyCharity = {
                'Tháng 1': 0,
                'Tháng 2': 0,
                'Tháng 3': 0,
                'Tháng 4': 0,
                'Tháng 5': 0,
                'Tháng 6': 0,
                'Tháng 7': 0,
                'Tháng 8': 0,
                'Tháng 9': 0,
                'Tháng 10': 0,
                'Tháng 11': 0,
                'Tháng 12': 0,
            };
            let totalGive = 0;
            let minGive = null;
            let maxGive = null;
            result.forEach((entry) => {
                const month = entry._id;
                const numOfGive = entry.totalCharity;
                monthlyCharity[`Tháng ${month}`] = numOfGive;
                totalGive += numOfGive;
                if (!minGive || numOfGive < minGive.numOfGive) {
                    minGive = { month: `Tháng ${month}`, numOfGive };
                }
                if (!maxGive || numOfGive > maxGive.numOfGive) {
                    maxGive = { month: `Tháng ${month}`, numOfGive };
                }
            });
            const response = {
                data: monthlyCharity,
                charityTotalAllTime: await this.countCharityAllTime(storeId),
                charityTotalInYear: totalGive,
                minGive,
                maxGive,
            };
            return response;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByStatus(idCondition, pageQuery, limitQuery, statusQuery) {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const skip = limit * (page - 1);
        try {
            const total = await this.billModel.countDocuments({ ...idCondition, status: statusQuery.toUpperCase() });
            const bills = await this.billModel
                .find({ ...idCondition, status: statusQuery.toUpperCase() })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip);
            return { total, bills };
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getById(id) {
        try {
            const bill = await this.billModel.findById(id);
            return bill;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getMyBill(id, userId) {
        try {
            const bill = await this.billModel.findOne({ _id: id, userId });
            return bill;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, status) {
        try {
            const bill = await this.billModel.findByIdAndUpdate({ _id: id }, { status });
            if (bill.paymentMethod === 'CASH' && status === 'DELIVERED') {
                bill.isPaid = true;
                bill.save();
            }
            return bill ? true : false;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async countProductDelivered(productId, type, status) {
        try {
            const total = await this.billModel.countDocuments({
                listProducts: {
                    $elemMatch: {
                        productId: productId.toString(),
                        type: type.toUpperCase(),
                    },
                },
                status: status.toUpperCase(),
            });
            return total;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async checkProductPurchased(productId) {
        try {
            const bill = await this.billModel.findOne({
                listProducts: {
                    $elemMatch: {
                        productId: productId.toString(),
                    },
                },
            });
            return bill ? true : false;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByUserId(userId) {
        try {
            const bills = await this.billModel.find({ userId });
            return bills;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async checkUserPurchasedByProductId(userId, productId) {
        try {
            const bill = await this.billModel.findOne({
                userId,
                listProducts: {
                    $elemMatch: {
                        productId: productId.toString(),
                    },
                },
            });
            return bill ? true : false;
        }
        catch (err) {
            if (err instanceof mongoose_2.Error)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.BillService = BillService;
exports.BillService = BillService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], BillService);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const category_schema_1 = __webpack_require__(23);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let CategoryService = class CategoryService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async create(createCategoryDto) {
        try {
            return await this.categoryModel.create(createCategoryDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async findAllByCategoryName(id, status) {
        try {
            const query = id ? { _id: id } : {};
            if (status) {
                query['status'] = Boolean(status);
            }
            return await this.categoryModel.find(query).exec();
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getById(id) {
        try {
            return await this.categoryModel.findById(id);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CategoryService);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const notification_schema_1 = __webpack_require__(26);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let NotificationService = class NotificationService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    async create(notification) {
        try {
            const newNotification = await this.notificationModel.create(notification);
            return newNotification;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByUserId(userId, pageQuery, limitQuery) {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
        const skip = limit * (page - 1);
        try {
            const total = await this.notificationModel.countDocuments({ userIdTo: userId });
            const notifications = await this.notificationModel.find({ userIdTo: userId })
                .sort({ updatedAt: -1 })
                .limit(limit)
                .skip(skip);
            return { total, notifications };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, updateNoti) {
        try {
            const notification = await this.notificationModel.findByIdAndUpdate(id, updateNoti);
            if (!notification) {
                return false;
            }
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], NotificationService);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateProductDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "keywords", void 0);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilterDate = exports.FilterProduct = exports.ExcludeIds = exports.ProductDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_transformer_1 = __webpack_require__(59);
const class_validator_1 = __webpack_require__(20);
class ProductDto {
}
exports.ProductDto = ProductDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ProductDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ProductDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "storeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductDto.prototype, "storeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "quantitySold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "quantityGive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "revenue", void 0);
class ExcludeIds {
}
exports.ExcludeIds = ExcludeIds;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: true, example: ['65773c715dd856a17de6fc97', '65773c715dd856a17de6fc91'] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ExcludeIds.prototype, "ids", void 0);
class FilterProduct {
}
exports.FilterProduct = FilterProduct;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter Price Min', type: Number, required: false, example: 100000 }),
    __metadata("design:type", Number)
], FilterProduct.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter Price Max', type: Number, required: false, example: 300000 }),
    __metadata("design:type", Number)
], FilterProduct.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter Quantity Min', type: Number, required: false, example: 1 }),
    __metadata("design:type", Number)
], FilterProduct.prototype, "quantityMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter Quantity Max', type: Number, required: false, example: 10 }),
    __metadata("design:type", Number)
], FilterProduct.prototype, "quantityMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter createdAt Min', required: false, example: '2023-01-01' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : null)),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], FilterProduct.prototype, "createdAtMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter createdAt Max', required: false, example: '2024-01-01' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : null)),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], FilterProduct.prototype, "createdAtMax", void 0);
class FilterDate {
}
exports.FilterDate = FilterDate;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Next element', required: false, example: '2023-01-01' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : null)),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], FilterDate.prototype, "date", void 0);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProductDto = void 0;
const swagger_1 = __webpack_require__(13);
class UpdateProductDto {
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "keywords", void 0);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoreModule = void 0;
const common_1 = __webpack_require__(6);
const store_service_1 = __webpack_require__(50);
const store_controller_1 = __webpack_require__(83);
const mongoose_1 = __webpack_require__(17);
const store_schema_1 = __webpack_require__(30);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const user_module_1 = __webpack_require__(63);
const feedback_module_1 = __webpack_require__(87);
const product_module_1 = __webpack_require__(74);
let StoreModule = class StoreModule {
};
exports.StoreModule = StoreModule;
exports.StoreModule = StoreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Store', schema: store_schema_1.StoreSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            (0, common_1.forwardRef)(() => product_module_1.ProductModule),
            feedback_module_1.FeedbackModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
        ],
        controllers: [store_controller_1.StoreController],
        providers: [store_service_1.StoreService],
        exports: [store_service_1.StoreService],
    })
], StoreModule);


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoreController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const get_current_userid_decorator_1 = __webpack_require__(55);
const public_decorator_1 = __webpack_require__(56);
const error_response_1 = __webpack_require__(41);
const success_response_1 = __webpack_require__(42);
const feedback_service_1 = __webpack_require__(84);
const product_service_1 = __webpack_require__(45);
const role_service_1 = __webpack_require__(39);
const role_schema_1 = __webpack_require__(34);
const user_service_1 = __webpack_require__(51);
const create_store_dto_1 = __webpack_require__(85);
const update_store_dto_1 = __webpack_require__(86);
const store_service_1 = __webpack_require__(50);
let StoreController = class StoreController {
    constructor(storeService, userService, roleService, feedbackService, productService) {
        this.storeService = storeService;
        this.userService = userService;
        this.roleService = roleService;
        this.feedbackService = feedbackService;
        this.productService = productService;
    }
    async create(store, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const hasStore = await this.storeService.getByUserId(userId);
        if (hasStore)
            return new error_response_1.ConflictException('Người dùng này đã có cửa hàng!');
        const newStore = await this.storeService.create(userId, store);
        if (!newStore)
            return new error_response_1.BadRequestException('Tạo cửa hàng thất bại!');
        const resultAddRole = await this.roleService.addUserToRole(userId, { name: role_schema_1.RoleName.SELLER });
        if (!resultAddRole)
            return new error_response_1.BadRequestException('Thêm quyền thất bại!');
        return new success_response_1.SuccessResponse({
            message: 'Tạo cửa hàng thành công!',
            metadata: { data: newStore },
        });
    }
    async getMyStore(userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin cửa hàng thành công!',
            metadata: { data: store },
        });
    }
    async getReputation(storeId) {
        const store = await this.storeService.getById(storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const products = await this.productService.getProductsByStoreId(storeId);
        let totalFeedback = 0;
        let totalProductsHasFeedback = 0;
        let totalAverageStar = 0;
        let averageStar = 0;
        await Promise.all(products.map(async (product) => {
            const feedbacks = await this.feedbackService.getAllByProductId(product._id);
            if (feedbacks.length === 0)
                return;
            totalFeedback += feedbacks.length;
            const star = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            feedbacks.forEach(feedback => {
                star[feedback.star]++;
            });
            let averageStar = 0;
            Object.keys(star).forEach(key => {
                averageStar += star[key] * Number(key);
            });
            averageStar = Number((averageStar / feedbacks.length).toFixed(2));
            totalAverageStar += averageStar;
            totalProductsHasFeedback++;
        }));
        if (totalProductsHasFeedback !== 0)
            averageStar = Number((totalAverageStar / totalProductsHasFeedback).toFixed(2));
        const totalFollow = await this.userService.countTotalFollowStoresByStoreId(storeId);
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin độ uy tín cửa hàng thành công!',
            metadata: { averageStar, totalFeedback, totalFollow },
        });
    }
    async getListStoreHaveMostProducts(limit) {
        const stores = await this.productService.getListStoreHaveMostProducts(Number(limit));
        const data = await Promise.all(stores.map(async (item) => {
            let store = await this.storeService.getById(item._id);
            if (!store)
                throw new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
            store = store.toObject();
            delete store.status;
            delete store.__v;
            delete store['createdA'];
            delete store['updatedAt'];
            return { store, totalProducts: item.count };
        }));
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin danh sách cửa hàng có nhiều sản phẩm nhất thành công!',
            metadata: { data },
        });
    }
    async getById(id) {
        const store = await this.storeService.getById(id);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        delete store.__v;
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin cửa hàng thành công!',
            metadata: { data: store },
        });
    }
    async delete(userId) {
        const result = await this.storeService.delete(userId);
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const isDeleted = await this.roleService.removeUserRole(userId, role_schema_1.RoleName.SELLER);
        if (!isDeleted)
            return new error_response_1.BadRequestException('Xóa quyền thất bại!');
        return new success_response_1.SuccessResponse({
            message: 'Xóa cửa hàng thành công!',
            metadata: { data: result },
        });
    }
    async update(store, userId) {
        const newStore = await this.storeService.update(userId, store);
        if (!newStore)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật thông tin cửa hàng thành công!',
            metadata: { data: newStore },
        });
    }
    async updateWarningCount(id, action) {
        const store = await this.storeService.updateWarningCount(id, action);
        if (!store)
            throw new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật cảnh báo thành công!',
            metadata: { data: store },
        });
    }
};
exports.StoreController = StoreController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Post)('store/user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof create_store_dto_1.CreateStoreDto !== "undefined" && create_store_dto_1.CreateStoreDto) === "function" ? _f : Object, String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], StoreController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER, role_schema_1.RoleName.USER),
    (0, common_1.Get)('store/seller'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], StoreController.prototype, "getMyStore", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiQuery)({ name: 'storeId', type: String, required: true }),
    (0, common_1.Get)('store-reputation'),
    __param(0, (0, common_1.Query)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], StoreController.prototype, "getReputation", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, common_1.Get)('stores-most-products'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], StoreController.prototype, "getListStoreHaveMostProducts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('store/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], StoreController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeleteStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Delete)('store/seller'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], StoreController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Put)('store/seller'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof update_store_dto_1.UpdateStoreDto !== "undefined" && update_store_dto_1.UpdateStoreDto) === "function" ? _o : Object, String]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], StoreController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateStoreAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Put)('store/manager/warningcount/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], StoreController.prototype, "updateWarningCount", null);
exports.StoreController = StoreController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('Store'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof store_service_1.StoreService !== "undefined" && store_service_1.StoreService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object, typeof (_c = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _c : Object, typeof (_d = typeof feedback_service_1.FeedbackService !== "undefined" && feedback_service_1.FeedbackService) === "function" ? _d : Object, typeof (_e = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _e : Object])
], StoreController);


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
const feedback_schema_1 = __webpack_require__(25);
let FeedbackService = class FeedbackService {
    constructor(feedbackModel) {
        this.feedbackModel = feedbackModel;
    }
    async create(userId, productId, feedback) {
        try {
            const newFeedback = await this.feedbackModel.create(feedback);
            newFeedback.userId = userId;
            newFeedback.productId = productId;
            await newFeedback.save();
            return newFeedback;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async getAllByProductIdPaging(page = 1, limit = 5, productId) {
        const skip = limit * (page - 1);
        try {
            const total = await this.feedbackModel.countDocuments({ productId });
            const feedbacks = await this.feedbackModel.find({ productId }).sort({ createdAt: -1 }).limit(limit).skip(skip);
            return { total, feedbacks };
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError) {
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }
    async getAllByProductId(productId) {
        try {
            const feedbacks = await this.feedbackModel.find({ productId }).sort({ createdAt: -1 });
            return feedbacks;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError) {
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }
    async updateConsensus(userId, productId, userIdConsensus) {
        try {
            const feedback = await this.feedbackModel.findOne({ userId, productId });
            if (!feedback)
                return false;
            const index = feedback.consensus.findIndex(id => id.toString() === userIdConsensus.toString());
            index == -1 ? feedback.consensus.push(userIdConsensus) : feedback.consensus.splice(index, 1);
            await feedback.save();
            return true;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(feedback_schema_1.Feedback.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], FeedbackService);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateStoreDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class CreateStoreDto {
}
exports.CreateStoreDto = CreateStoreDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateStoreDto.prototype, "phoneNumber", void 0);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateStoreDto = void 0;
const swagger_1 = __webpack_require__(13);
class UpdateStoreDto {
}
exports.UpdateStoreDto = UpdateStoreDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], UpdateStoreDto.prototype, "phoneNumber", void 0);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackModule = void 0;
const common_1 = __webpack_require__(6);
const feedback_service_1 = __webpack_require__(84);
const feedback_controller_1 = __webpack_require__(88);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const feedback_schema_1 = __webpack_require__(25);
const user_module_1 = __webpack_require__(63);
let FeedbackModule = class FeedbackModule {
};
exports.FeedbackModule = FeedbackModule;
exports.FeedbackModule = FeedbackModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Feedback', schema: feedback_schema_1.FeedbackSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
        ],
        controllers: [feedback_controller_1.FeedbackController],
        providers: [feedback_service_1.FeedbackService],
        exports: [feedback_service_1.FeedbackService],
    })
], FeedbackModule);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const error_response_1 = __webpack_require__(41);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const get_current_userid_decorator_1 = __webpack_require__(55);
const public_decorator_1 = __webpack_require__(56);
const success_response_1 = __webpack_require__(42);
const role_schema_1 = __webpack_require__(34);
const user_service_1 = __webpack_require__(51);
const create_feedback_dto_1 = __webpack_require__(89);
const feedback_service_1 = __webpack_require__(84);
let FeedbackController = class FeedbackController {
    constructor(feedbackService, userService) {
        this.feedbackService = feedbackService;
        this.userService = userService;
    }
    async create(productId, feedback, userId) {
        const newFeedback = await this.feedbackService.create(userId, productId, feedback);
        await this.userService.updateWallet(userId, 5000, 'plus');
        return new success_response_1.SuccessResponse({
            message: 'Đánh giá thành công!',
            metadata: { data: newFeedback },
        });
    }
    async getAllByProductIdPaging(page, limit, productId, userId) {
        const feedbacks = await this.feedbackService.getAllByProductIdPaging(page, limit, productId);
        const data = await Promise.all(feedbacks.feedbacks.map(async (feedback) => {
            const user = await this.userService.getById(feedback.userId);
            return {
                star: feedback.star,
                content: feedback.content,
                avatar: user.avatar,
                name: user.fullName,
                consensus: feedback.consensus,
                isConsensus: false,
                createdAt: feedback['createdAt'],
                userId: feedback.userId,
            };
        }));
        if (userId) {
            data.forEach((feedback) => {
                if (feedback.consensus.includes(userId)) {
                    feedback.isConsensus = true;
                }
            });
        }
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách đánh giá thành công!',
            metadata: { total: feedbacks.total, data },
        });
    }
    async getAllByProductIdStar(productId) {
        const feedbacks = await this.feedbackService.getAllByProductId(productId);
        const star = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        const startPercent = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (feedbacks.length === 0)
            return new success_response_1.SuccessResponse({
                message: 'Lấy danh sách đánh giá sao thành công!',
                metadata: { startPercent, averageStar: 0 },
            });
        feedbacks.forEach(feedback => {
            star[feedback.star]++;
        });
        Object.keys(star).forEach(key => {
            startPercent[key] = Math.round((star[key] / feedbacks.length) * 100);
        });
        let averageStar = 0;
        Object.keys(star).forEach(key => {
            averageStar += star[key] * Number(key);
        });
        averageStar = Number((averageStar / feedbacks.length).toFixed(2));
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách đánh giá sao thành công!',
            metadata: { startPercent, averageStar },
        });
    }
    async updateConsensus(userId, productId, userIdConsensus) {
        if (userId === userIdConsensus)
            return new error_response_1.BadRequestException('Bạn không thể đồng thuận với chính mình!');
        const result = await this.feedbackService.updateConsensus(userId, productId, userIdConsensus);
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy đánh giá này!');
        return new success_response_1.SuccessResponse({
            message: 'Đồng thuận thành công!',
            metadata: { data: { result } },
        });
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateFeedBackAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, common_1.Post)('feedback/user'),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof create_feedback_dto_1.CreateFeedbackDto !== "undefined" && create_feedback_dto_1.CreateFeedbackDto) === "function" ? _c : Object, String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], FeedbackController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('feedback'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('productId')),
    __param(3, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], FeedbackController.prototype, "getAllByProductIdPaging", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('feedback-star'),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    __param(0, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], FeedbackController.prototype, "getAllByProductIdStar", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateFeedBackAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, common_1.Put)('feedback-consensus'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('productId')),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], FeedbackController.prototype, "updateConsensus", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('FeedBack'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof feedback_service_1.FeedbackService !== "undefined" && feedback_service_1.FeedbackService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object])
], FeedbackController);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateFeedbackDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class CreateFeedbackDto {
}
exports.CreateFeedbackDto = CreateFeedbackDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "star", void 0);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EvaluationModule = void 0;
const common_1 = __webpack_require__(6);
const evaluation_service_1 = __webpack_require__(43);
const evaluation_controller_1 = __webpack_require__(91);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const evaluation_schema_1 = __webpack_require__(24);
const notification_module_1 = __webpack_require__(93);
const product_module_1 = __webpack_require__(74);
const user_module_1 = __webpack_require__(63);
const store_module_1 = __webpack_require__(82);
const bill_module_1 = __webpack_require__(65);
let EvaluationModule = class EvaluationModule {
};
exports.EvaluationModule = EvaluationModule;
exports.EvaluationModule = EvaluationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Evaluation', schema: evaluation_schema_1.EvaluationSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            notification_module_1.NotificationModule,
            (0, common_1.forwardRef)(() => store_module_1.StoreModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => product_module_1.ProductModule),
            (0, common_1.forwardRef)(() => bill_module_1.BillModule),
        ],
        controllers: [evaluation_controller_1.EvaluationController],
        providers: [evaluation_service_1.EvaluationService],
        exports: [evaluation_service_1.EvaluationService]
    })
], EvaluationModule);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EvaluationController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const get_current_userid_decorator_1 = __webpack_require__(55);
const public_decorator_1 = __webpack_require__(56);
const bill_service_1 = __webpack_require__(76);
const error_response_1 = __webpack_require__(41);
const success_response_1 = __webpack_require__(42);
const notification_service_1 = __webpack_require__(78);
const product_service_1 = __webpack_require__(45);
const role_schema_1 = __webpack_require__(34);
const store_service_1 = __webpack_require__(50);
const user_service_1 = __webpack_require__(51);
const body_dto_1 = __webpack_require__(92);
const evaluation_service_1 = __webpack_require__(43);
let EvaluationController = class EvaluationController {
    constructor(evaluationService, notificationService, productService, userService, storeService, billService) {
        this.evaluationService = evaluationService;
        this.notificationService = notificationService;
        this.productService = productService;
        this.userService = userService;
        this.storeService = storeService;
        this.billService = billService;
    }
    async create(productId, evaluationDto, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const product = await this.productService.getById(productId);
        if (!product)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const store = await this.storeService.getById(product.storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const hadEvaluation = await this.evaluationService.checkEvaluationByUserIdAndProductId(userId, productId);
        const result = await this.evaluationService.update(userId, productId, evaluationDto.name);
        console.log(result);
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        if (userId !== store.userId && !hadEvaluation) {
            const createNotiData = {
                userIdFrom: userId,
                userIdTo: store.userId,
                content: 'đã bày tỏ cảm xúc về sản phẩm của bạn!',
                type: evaluationDto.name,
                sub: {
                    fullName: user.fullName,
                    avatar: user.avatar,
                    productId: productId.toString(),
                },
            };
            await this.notificationService.create(createNotiData);
        }
        return new success_response_1.SuccessResponse({
            message: 'Đánh giá thành công!',
            metadata: { data: result },
        });
    }
    async getByProductId(productId, userId) {
        const evaluation = await this.evaluationService.getByProductId(productId);
        if (!evaluation)
            return new error_response_1.NotFoundException('Không tìm thấy sản phẩm này!');
        const total = evaluation.emojis.length;
        const emoji = {
            Haha: 0,
            Love: 0,
            Wow: 0,
            Sad: 0,
            Angry: 0,
            like: 0,
        };
        evaluation.emojis.forEach(e => {
            switch (e.name) {
                case 'Haha':
                    emoji.Haha++;
                    break;
                case 'Love':
                    emoji.Love++;
                    break;
                case 'Wow':
                    emoji.Wow++;
                    break;
                case 'Sad':
                    emoji.Sad++;
                    break;
                case 'Angry':
                    emoji.Angry++;
                    break;
                case 'like':
                    emoji.like++;
                    break;
            }
        });
        let isReaction = false;
        let isPurchased = false;
        if (userId) {
            const evaluationOfUser = evaluation.emojis.find(emoji => emoji.userId.toString() === userId.toString());
            evaluationOfUser ? (isReaction = true) : (isReaction = false);
            isPurchased = await this.billService.checkUserPurchasedByProductId(userId, productId);
        }
        const data = {
            total,
            haha: emoji.Haha,
            love: emoji.Love,
            wow: emoji.Wow,
            sad: emoji.Sad,
            angry: emoji.Angry,
            like: emoji.like,
            isReaction,
            isPurchased,
        };
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách đánh giá thành công!',
            metadata: { data },
        });
    }
};
exports.EvaluationController = EvaluationController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateEvaluationAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, common_1.Put)('user'),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof body_dto_1.EvaluationDto !== "undefined" && body_dto_1.EvaluationDto) === "function" ? _g : Object, String]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], EvaluationController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String, required: false }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], EvaluationController.prototype, "getByProductId", null);
exports.EvaluationController = EvaluationController = __decorate([
    (0, common_1.Controller)('evaluation'),
    (0, swagger_1.ApiTags)('Evaluation'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof evaluation_service_1.EvaluationService !== "undefined" && evaluation_service_1.EvaluationService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object, typeof (_c = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _c : Object, typeof (_d = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _d : Object, typeof (_e = typeof store_service_1.StoreService !== "undefined" && store_service_1.StoreService) === "function" ? _e : Object, typeof (_f = typeof bill_service_1.BillService !== "undefined" && bill_service_1.BillService) === "function" ? _f : Object])
], EvaluationController);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EvaluationDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class EvaluationDto {
}
exports.EvaluationDto = EvaluationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EvaluationDto.prototype, "name", void 0);


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(6);
const notification_service_1 = __webpack_require__(78);
const notification_controller_1 = __webpack_require__(94);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const notification_schema_1 = __webpack_require__(26);
const user_module_1 = __webpack_require__(63);
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Notification', schema: notification_schema_1.NotificationSchema }]),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
        ],
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService],
        exports: [notification_service_1.NotificationService]
    })
], NotificationModule);


/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(6);
const notification_service_1 = __webpack_require__(78);
const create_notification_dto_1 = __webpack_require__(95);
const public_decorator_1 = __webpack_require__(56);
const swagger_1 = __webpack_require__(13);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const role_schema_1 = __webpack_require__(34);
const get_current_userid_decorator_1 = __webpack_require__(55);
const user_service_1 = __webpack_require__(51);
const update_notification_dto_1 = __webpack_require__(96);
const success_response_1 = __webpack_require__(42);
const error_response_1 = __webpack_require__(41);
let NotificationController = class NotificationController {
    constructor(notificationService, userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }
    async create(notification) {
        const newNotification = await this.notificationService.create(notification);
        return new success_response_1.SuccessResponse({
            message: "Tạo thông báo thành công!",
            metadata: { data: newNotification },
        });
    }
    async getAllByUserId(page, limit, userId) {
        const data = await this.notificationService.getAllByUserId(userId, page, limit);
        return new success_response_1.SuccessResponse({
            message: "Lấy danh sách thông báo thành công!",
            metadata: { data },
        });
    }
    async update(id, updateNoti) {
        const result = await this.notificationService.update(id, updateNoti);
        if (!result)
            return new error_response_1.NotFoundException("Không tìm thấy thông báo này!");
        return new success_response_1.SuccessResponse({
            message: "Cập nhật thông báo thành công!",
            metadata: { data: result },
        });
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_notification_dto_1.CreateNotificationDto !== "undefined" && create_notification_dto_1.CreateNotificationDto) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadNotificationAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER, role_schema_1.RoleName.USER),
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], NotificationController.prototype, "getAllByUserId", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateNotificationAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER, role_schema_1.RoleName.USER),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_notification_dto_1.UpdateNotificationDto !== "undefined" && update_notification_dto_1.UpdateNotificationDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], NotificationController.prototype, "update", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notification'),
    (0, swagger_1.ApiTags)('Notification'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object])
], NotificationController);


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateNotificationDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
const sub_notification_dto_1 = __webpack_require__(27);
class CreateNotificationDto {
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "userIdFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "userIdTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof sub_notification_dto_1.SubNoti !== "undefined" && sub_notification_dto_1.SubNoti) === "function" ? _a : Object)
], CreateNotificationDto.prototype, "sub", void 0);


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateNotificationDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class UpdateNotificationDto {
    constructor() {
        this.status = true;
    }
}
exports.UpdateNotificationDto = UpdateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateNotificationDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateNotificationDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], UpdateNotificationDto.prototype, "status", void 0);


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryModule = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const category_schema_1 = __webpack_require__(23);
const category_controller_1 = __webpack_require__(98);
const category_service_1 = __webpack_require__(77);
let CategoryModule = class CategoryModule {
};
exports.CategoryModule = CategoryModule;
exports.CategoryModule = CategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Category', schema: category_schema_1.CategorySchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
        ],
        controllers: [category_controller_1.CategoryController],
        providers: [category_service_1.CategoryService],
        exports: [category_service_1.CategoryService]
    })
], CategoryModule);


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const public_decorator_1 = __webpack_require__(56);
const success_response_1 = __webpack_require__(42);
const role_schema_1 = __webpack_require__(34);
const category_service_1 = __webpack_require__(77);
const create_category_dto_1 = __webpack_require__(99);
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(createCategoryDto) {
        const data = await this.categoryService.create(createCategoryDto);
        return new success_response_1.SuccessResponse({
            message: 'Tạo danh mục thành công!',
            metadata: { data },
        });
    }
    async findAllByCategoryName(id, status) {
        const data = await this.categoryService.findAllByCategoryName(id, status);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách danh mục thành công!',
            metadata: { data },
        });
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateCategoryAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Post)('manager'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_category_dto_1.CreateCategoryDto !== "undefined" && create_category_dto_1.CreateCategoryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], CategoryController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(''),
    (0, swagger_1.ApiQuery)({ name: 'id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], CategoryController.prototype, "findAllByCategoryName", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('category'),
    (0, swagger_1.ApiTags)('Category'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _a : Object])
], CategoryController);


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCategoryDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class CreateCategoryDto {
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const get_current_userid_decorator_1 = __webpack_require__(55);
const cart_service_1 = __webpack_require__(67);
const error_response_1 = __webpack_require__(41);
const success_response_1 = __webpack_require__(42);
const product_service_1 = __webpack_require__(45);
const role_schema_1 = __webpack_require__(34);
const store_service_1 = __webpack_require__(50);
const user_service_1 = __webpack_require__(51);
const bill_service_1 = __webpack_require__(76);
const create_bill_dto_1 = __webpack_require__(19);
const payment_gateway_1 = __webpack_require__(21);
const payment_service_1 = __webpack_require__(101);
const bill_schema_1 = __webpack_require__(16);
let BillController = class BillController {
    constructor(billService, paymentService, userService, productService, storeService, cartService) {
        this.billService = billService;
        this.paymentService = paymentService;
        this.userService = userService;
        this.productService = productService;
        this.storeService = storeService;
        this.cartService = cartService;
        this.paymentService.registerPaymentGateway(payment_gateway_1.PAYMENT_METHOD.VNPAY, new payment_gateway_1.VNPayGateway());
        this.paymentService.registerPaymentGateway(payment_gateway_1.PAYMENT_METHOD.MOMO, new payment_gateway_1.MoMoGateway());
        this.paymentService.registerPaymentGateway(payment_gateway_1.PAYMENT_METHOD.GIVE, new payment_gateway_1.GiveGateway());
    }
    async create(createBillDto, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const newBills = await Promise.all(createBillDto.data.map(async (billDto) => {
            await this.userService.updateWallet(userId, billDto.totalPrice, 'plus');
            await this.cartService.removeMultiProductInCart(userId, billDto.listProducts, billDto.storeId);
            billDto.listProducts.forEach(async (product) => {
                await this.productService.updateQuantity(product.productId, product.quantity);
            });
            const newBill = await this.billService.create(userId, billDto, createBillDto.deliveryMethod, createBillDto.paymentMethod, createBillDto.receiverInfo, createBillDto.giveInfo, createBillDto.deliveryFee);
            return newBill;
        }));
        return new success_response_1.SuccessResponse({
            message: 'Đặt hàng thành công!',
            metadata: { data: newBills },
        });
    }
    async countTotalByStatusSeller(year, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const statusData = bill_schema_1.BILL_STATUS.split('-').map((item) => item.toUpperCase());
        const countTotal = await Promise.all(statusData.map(async (status) => {
            return this.billService.countTotalByStatusSeller(store._id, status, year);
        }));
        const transformedData = Object.fromEntries(countTotal.map((value, index) => [statusData[index], value]));
        return new success_response_1.SuccessResponse({
            message: 'Lấy tổng số lượng các đơn theo trạng thái thành công!',
            metadata: { data: transformedData },
        });
    }
    async countTotalByStatusUser(userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const statusData = bill_schema_1.BILL_STATUS.split('-').map((item) => item.toUpperCase());
        const countTotal = await Promise.all(statusData.map(async (status) => {
            return this.billService.countTotalByStatusUser(userId, status);
        }));
        const transformedData = countTotal.map((value, index) => {
            return {
                status: statusData[index],
                title: bill_schema_1.BILL_STATUS_TRANSITION[statusData[index]],
                value: value,
            };
        });
        return new success_response_1.SuccessResponse({
            message: 'Lấy tổng số lượng các đơn theo trạng thái thành công!',
            metadata: { data: transformedData },
        });
    }
    async calculateRevenueByYear(year, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const data = await this.billService.calculateRevenueByYear(store._id, year);
        return new success_response_1.SuccessResponse({
            message: 'Lấy doanh thu của từng tháng theo năm thành công!',
            metadata: { data },
        });
    }
    async countCharityByYear(year, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const data = await this.billService.countCharityByYear(store._id, year);
        return new success_response_1.SuccessResponse({
            message: 'Lấy kết quả từ thiện của từng tháng theo năm thành công!',
            metadata: { data },
        });
    }
    async getAllByStatusUser(page, limit, status, userId) {
        const user = await this.userService.getById(userId);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const data = await this.billService.getAllByStatus({ userId }, page, limit, status);
        const fullData = await Promise.all(data.bills.map(async (bill) => {
            const listProductsFullInfo = await Promise.all(bill.listProducts.map(async (product) => {
                const productFullInfo = await this.productService.getById(product.productId);
                const productData = {
                    product: productFullInfo,
                    subInfo: product,
                };
                delete productData.subInfo.productId;
                delete productData.subInfo.type;
                return productData;
            }));
            const storeInfo = await this.storeService.getById(bill.storeId);
            let userInfo = await this.userService.getById(bill.userId);
            userInfo = userInfo.toObject();
            delete userInfo.password;
            return {
                _id: bill._id,
                storeInfo,
                listProductsFullInfo,
                userInfo,
                notes: bill.notes,
                totalPrice: bill.totalPrice,
                deliveryMethod: bill.deliveryMethod,
                paymentMethod: bill.paymentMethod,
                receiverInfo: bill.receiverInfo,
                giveInfo: bill.giveInfo,
                deliveryFee: bill.deliveryFee,
                status: bill.status,
                isPaid: bill.isPaid,
                createdAt: bill.createdAt,
            };
        }));
        return new success_response_1.SuccessResponse({
            message: `Lấy danh sách đơn hàng ${role_schema_1.RoleName.USER} thành công!`,
            metadata: { data: { total: data.total, fullData } },
        });
    }
    async getAllByStatusSeller(page, limit, status, userId) {
        const store = await this.storeService.getByUserId(userId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        const data = await this.billService.getAllByStatus({ storeId: store._id }, page, limit, status);
        const fullData = await Promise.all(data.bills.map(async (bill) => {
            const listProductsFullInfo = await Promise.all(bill.listProducts.map(async (product) => {
                const productFullInfo = await this.productService.getById(product.productId);
                const productData = {
                    product: productFullInfo,
                    subInfo: product,
                };
                delete productData.subInfo.productId;
                delete productData.subInfo.type;
                return productData;
            }));
            const storeInfo = await this.storeService.getById(bill.storeId);
            let userInfo = await this.userService.getById(bill.userId);
            userInfo = userInfo.toObject();
            delete userInfo.password;
            return {
                _id: bill._id,
                storeInfo,
                listProductsFullInfo,
                userInfo,
                notes: bill.notes,
                totalPrice: bill.totalPrice,
                deliveryMethod: bill.deliveryMethod,
                paymentMethod: bill.paymentMethod,
                receiverInfo: bill.receiverInfo,
                giveInfo: bill.giveInfo,
                deliveryFee: bill.deliveryFee,
                status: bill.status,
                isPaid: bill.isPaid,
                createdAt: bill.createdAt,
            };
        }));
        return new success_response_1.SuccessResponse({
            message: `Lấy danh sách đơn hàng ${role_schema_1.RoleName.SELLER} thành công!`,
            metadata: { data: { total: data.total, fullData } },
        });
    }
    async getMyBill(id, userId) {
        const bill = await this.billService.getMyBill(id, userId);
        if (!bill)
            return new error_response_1.NotFoundException('Không tìm thấy đơn hàng này!');
        const listProductsFullInfo = await Promise.all(bill.listProducts.map(async (product) => {
            const productFullInfo = await this.productService.getById(product.productId);
            const productData = {
                product: productFullInfo,
                subInfo: product,
            };
            delete productData.subInfo.productId;
            delete productData.subInfo.type;
            return productData;
        }));
        const storeInfo = await this.storeService.getById(bill.storeId);
        let userInfo = await this.userService.getById(bill.userId);
        userInfo = userInfo.toObject();
        delete userInfo.password;
        const fullData = {
            _id: bill._id,
            storeInfo,
            listProductsFullInfo,
            userInfo,
            notes: bill.notes,
            totalPrice: bill.totalPrice,
            deliveryMethod: bill.deliveryMethod,
            paymentMethod: bill.paymentMethod,
            receiverInfo: bill.receiverInfo,
            giveInfo: bill.giveInfo,
            deliveryFee: bill.deliveryFee,
            status: bill.status,
            isPaid: bill.isPaid,
            createdAt: bill.createdAt,
        };
        return new success_response_1.SuccessResponse({
            message: `Lấy đơn hàng thành công!`,
            metadata: { data: fullData },
        });
    }
    async cancelBill(id, userId) {
        const bill = await this.billService.getById(id);
        const result = await this.billService.update(id, 'CANCELLED');
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy đơn hàng này!');
        await this.userService.updateWallet(userId, bill.totalPrice, 'sub');
        return new success_response_1.SuccessResponse({
            message: 'Hủy đơn hàng thành công!',
            metadata: { data: result },
        });
    }
    async updateStatus(id, status) {
        const bill = await this.billService.getById(id);
        if (!bill)
            return new error_response_1.NotFoundException('Không tìm thấy đơn hàng này!');
        const result = await this.billService.update(id, status);
        if (!result)
            return new error_response_1.NotFoundException('Không tìm thấy đơn hàng này!');
        if (status === 'CANCELLED')
            await this.userService.updateWallet(bill.userId, bill.totalPrice, 'sub');
        if (status === 'RETURNED') {
            await this.userService.updateWallet(bill.userId, bill.totalPrice, 'sub');
            await this.userService.updateWallet(bill.userId, bill.totalPrice * 5, 'plus');
        }
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật trạng thái đơn hàng thành công!',
            metadata: { data: result },
        });
    }
};
exports.BillController = BillController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Post)('user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof create_bill_dto_1.CreateBillDto !== "undefined" && create_bill_dto_1.CreateBillDto) === "function" ? _g : Object, String]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], BillController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, swagger_1.ApiQuery)({ name: 'year', type: Number, required: false, example: '2023' }),
    (0, common_1.Get)('seller/count-total-by-status'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], BillController.prototype, "countTotalByStatusSeller", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('user/count-total-by-status'),
    __param(0, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], BillController.prototype, "countTotalByStatusUser", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, swagger_1.ApiQuery)({ name: 'year', type: Number, required: true, example: '2023' }),
    (0, common_1.Get)('seller/calculate-revenue-by-year'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], BillController.prototype, "calculateRevenueByYear", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, swagger_1.ApiQuery)({ name: 'year', type: Number, required: true, example: '2023' }),
    (0, common_1.Get)('seller/count-charity-by-year'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], BillController.prototype, "countCharityByYear", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('user'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: true, example: 'NEW' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
], BillController.prototype, "getAllByStatusUser", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Get)('seller'),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: true, example: 'NEW' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], BillController.prototype, "getAllByStatusSeller", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], BillController.prototype, "getMyBill", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, common_1.Put)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], BillController.prototype, "cancelBill", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateBillAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.SELLER),
    (0, common_1.Put)('/seller/:id'),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
], BillController.prototype, "updateStatus", null);
exports.BillController = BillController = __decorate([
    (0, common_1.Controller)('bill'),
    (0, swagger_1.ApiTags)('Bill'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof bill_service_1.BillService !== "undefined" && bill_service_1.BillService) === "function" ? _a : Object, typeof (_b = typeof payment_service_1.PaymentService !== "undefined" && payment_service_1.PaymentService) === "function" ? _b : Object, typeof (_c = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _c : Object, typeof (_d = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _d : Object, typeof (_e = typeof store_service_1.StoreService !== "undefined" && store_service_1.StoreService) === "function" ? _e : Object, typeof (_f = typeof cart_service_1.CartService !== "undefined" && cart_service_1.CartService) === "function" ? _f : Object])
], BillController);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentService = void 0;
const common_1 = __webpack_require__(6);
let PaymentService = class PaymentService {
    constructor() {
        this.paymentGateways = {};
    }
    registerPaymentGateway(paymentMethod, gateway) {
        this.paymentGateways[paymentMethod] = gateway;
    }
    async processPayment(bill, paymentMethod) {
        const gateway = this.paymentGateways[paymentMethod];
        if (gateway) {
            return await gateway.processPayment(bill);
        }
        else {
            return -1;
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentModule = void 0;
const common_1 = __webpack_require__(6);
const payment_service_1 = __webpack_require__(101);
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        providers: [payment_service_1.PaymentService],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HasPermitRoleMiddleware = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(18);
const role_schema_1 = __webpack_require__(34);
const role_service_1 = __webpack_require__(39);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
const error_response_1 = __webpack_require__(41);
let HasPermitRoleMiddleware = class HasPermitRoleMiddleware {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async use(req, res, next) {
        if (req.params.id) {
            try {
                const id = req.params.id;
                const roles = await this.roleService.getRoleNameByUserId(id);
                if (!roles) {
                    return new error_response_1.BadRequestException("Bạn không có quyền thực hiện hành động này!");
                }
                if (roles.includes(role_schema_1.RoleName.ADMIN) || roles.includes(role_schema_1.RoleName.MANAGER)) {
                    return new error_response_1.BadRequestException("Bạn không có quyền thực hiện hành động này!");
                }
            }
            catch (err) {
                if (err instanceof mongoose_1.MongooseError)
                    throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
                throw err;
            }
        }
        next();
    }
};
exports.HasPermitRoleMiddleware = HasPermitRoleMiddleware;
exports.HasPermitRoleMiddleware = HasPermitRoleMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _a : Object])
], HasPermitRoleMiddleware);


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HasSameRoleUserMiddleware = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(18);
const role_schema_1 = __webpack_require__(34);
const role_service_1 = __webpack_require__(39);
const error_response_1 = __webpack_require__(41);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let HasSameRoleUserMiddleware = class HasSameRoleUserMiddleware {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async use(req, res, next) {
        if (req.params.id) {
            try {
                const id1 = req.params.id;
                const id2 = req.body.id;
                const roles1 = await this.roleService.getRoleNameByUserId(id1);
                const roles2 = await this.roleService.getRoleNameByUserId(id2);
                if (!roles1 || !roles2) {
                    return new error_response_1.ForbiddenException("Bạn không có quyền thực hiện hành động này!");
                }
                if (roles1.includes(role_schema_1.RoleName.USER) || roles2.includes(role_schema_1.RoleName.USER)) {
                    {
                        return new error_response_1.ForbiddenException("Bạn không có quyền thực hiện hành động này!");
                    }
                }
            }
            catch (err) {
                if (err instanceof mongoose_1.MongooseError)
                    throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
                throw err;
            }
        }
        console.log("Pass HasSameRoleUserMiddleware");
        next();
    }
};
exports.HasSameRoleUserMiddleware = HasSameRoleUserMiddleware;
exports.HasSameRoleUserMiddleware = HasSameRoleUserMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _a : Object])
], HasSameRoleUserMiddleware);


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const abilities_guard_1 = __webpack_require__(38);
const get_current_userid_decorator_1 = __webpack_require__(55);
const bill_service_1 = __webpack_require__(76);
const error_response_1 = __webpack_require__(41);
const success_response_1 = __webpack_require__(42);
const role_service_1 = __webpack_require__(39);
const role_schema_1 = __webpack_require__(34);
const store_service_1 = __webpack_require__(50);
const update_user_dto_1 = __webpack_require__(52);
const user_service_1 = __webpack_require__(51);
let UserController = class UserController {
    constructor(userService, roleService, billService, storeService) {
        this.userService = userService;
        this.roleService = roleService;
        this.billService = billService;
        this.storeService = storeService;
    }
    async findOne(id) {
        const user = await this.userService.getById(id);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        const billsOfUser = await this.billService.getAllByUserId(id);
        const totalBills = billsOfUser.length;
        const totalPricePaid = billsOfUser.reduce((total, bill) => total + bill.totalPrice, 0);
        const totalReceived = billsOfUser.filter(bill => bill.totalPrice === 0).length;
        const data = {
            ...user.toObject(),
            totalBills,
            totalPricePaid,
            totalReceived,
        };
        return new success_response_1.SuccessResponse({
            message: 'Lấy thông tin người dùng thành công!',
            metadata: { data },
        });
    }
    async followStore(storeId, userId) {
        const store = await this.storeService.getById(storeId);
        if (!store)
            return new error_response_1.NotFoundException('Không tìm thấy cửa hàng này!');
        if (store.userId.toString() === userId)
            return new error_response_1.BadRequestException('Bạn không thể theo dõi cửa hàng của chính mình!');
        await this.userService.followStore(userId, storeId);
        return new success_response_1.SuccessResponse({
            message: 'Follow cửa hàng thành công!',
            metadata: { data: {} },
        });
    }
    async addFriend(userIdReceive, userIdSend) {
        const user = await this.userService.getById(userIdReceive);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        if (userIdReceive === userIdSend)
            return new error_response_1.BadRequestException('Bạn không thể kết bạn với chính mình!');
        await this.userService.addFriend(userIdSend, userIdReceive);
        return new success_response_1.SuccessResponse({
            message: 'Follow cửa hàng thành công!',
            metadata: { data: {} },
        });
    }
    async delete(id) {
        const user = await this.userService.delete(id);
        if (!user)
            return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
        return new success_response_1.SuccessResponse({
            message: 'Xóa người dùng thành công!',
            metadata: { data: user },
        });
    }
    async updateWarningCount(id, action) {
        const user = await this.userService.updateWarningCount(id, action);
        if (!user)
            return new error_response_1.BadRequestException('Không thể cập nhật số lần vi phạm!');
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật số lần vi phạm thành công!',
            metadata: { data: user },
        });
    }
    async getAll(page, limit, search) {
        const data = await this.userService.getAll(page, limit, search);
        return new success_response_1.SuccessResponse({
            message: 'Lấy danh sách người dùng thành công!',
            metadata: { data },
        });
    }
    async update(id, updateUserDto, userId) {
        const currentUserRole = await this.roleService.getRoleNameByUserId(userId);
        if (currentUserRole.includes(role_schema_1.RoleName.USER) && id !== userId) {
            return new error_response_1.ForbiddenException('Bạn không có quyền cập nhật thông tin người dùng khác!');
        }
        const updatedUser = await this.userService.update(id, updateUserDto);
        return new success_response_1.SuccessResponse({
            message: 'Cập nhật thông tin người dùng thành công!',
            metadata: { data: updatedUser },
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER, role_schema_1.RoleName.ADMIN),
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'storeId', type: String, required: true }),
    (0, common_1.Put)('user-follow-store'),
    __param(0, (0, common_1.Query)('storeId')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], UserController.prototype, "followStore", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER),
    (0, swagger_1.ApiQuery)({ name: 'userIdReceive', type: String, required: true }),
    (0, common_1.Put)('user-add-friend'),
    __param(0, (0, common_1.Query)('userIdReceive')),
    __param(1, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], UserController.prototype, "addFriend", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeleteUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER, role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Put)('manager/warningcount/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], UserController.prototype, "updateWarningCount", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Get)('admin'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], UserController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateUserAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.USER, role_schema_1.RoleName.ADMIN),
    (0, common_1.Patch)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_current_userid_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_l = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _l : Object, String]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], UserController.prototype, "update", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('User'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _b : Object, typeof (_c = typeof bill_service_1.BillService !== "undefined" && bill_service_1.BillService) === "function" ? _c : Object, typeof (_d = typeof store_service_1.StoreService !== "undefined" && store_service_1.StoreService) === "function" ? _d : Object])
], UserController);


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtATStrategy = void 0;
const common_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(62);
const passport_jwt_1 = __webpack_require__(107);
const user_service_1 = __webpack_require__(51);
let JwtATStrategy = class JwtATStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
        });
        this.userService = userService;
    }
    async validate(payload) {
        const user = await this.userService.getById(payload.userId);
        return { userId: user._id };
    }
};
exports.JwtATStrategy = JwtATStrategy;
exports.JwtATStrategy = JwtATStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], JwtATStrategy);


/***/ }),
/* 107 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtRTStrategy = void 0;
const common_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(62);
const passport_jwt_1 = __webpack_require__(107);
const user_service_1 = __webpack_require__(51);
let JwtRTStrategy = class JwtRTStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    constructor(userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
        });
        this.userService = userService;
    }
    async validate(req, payload) {
        const user = await this.userService.getById(payload.userId);
        const refreshToken = req.get('authorization').replace('Bearer ', '').trim();
        return {
            userId: user._id,
            refreshToken,
        };
    }
};
exports.JwtRTStrategy = JwtRTStrategy;
exports.JwtRTStrategy = JwtRTStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], JwtRTStrategy);


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtATAuthGuard = void 0;
const common_1 = __webpack_require__(6);
const core_1 = __webpack_require__(4);
const jwt_1 = __webpack_require__(10);
const user_service_1 = __webpack_require__(51);
const firebase_service_1 = __webpack_require__(110);
const role_schema_1 = __webpack_require__(34);
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
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object, typeof (_c = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _c : Object, typeof (_d = typeof firebase_service_1.FirebaseService !== "undefined" && firebase_service_1.FirebaseService) === "function" ? _d : Object])
], JwtATAuthGuard);


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FirebaseService = void 0;
const common_1 = __webpack_require__(6);
const firebase = __webpack_require__(111);
let FirebaseService = class FirebaseService {
    constructor() {
        this.getAuth = () => {
            return this.firebaseApp.auth();
        };
        if (!firebase.apps.length) {
            this.firebaseApp = firebase.initializeApp({
                credential: firebase.credential.cert({
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY,
                }),
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        }
        else {
            this.firebaseApp = firebase.apps[0];
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FirebaseService);


/***/ }),
/* 111 */
/***/ ((module) => {

"use strict";
module.exports = require("firebase-admin");

/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsertokenModule = void 0;
const common_1 = __webpack_require__(6);
const usertoken_service_1 = __webpack_require__(54);
const usertoken_controller_1 = __webpack_require__(113);
const mongoose_1 = __webpack_require__(17);
const usertoken_schema_1 = __webpack_require__(33);
let UsertokenModule = class UsertokenModule {
};
exports.UsertokenModule = UsertokenModule;
exports.UsertokenModule = UsertokenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'UserToken', schema: usertoken_schema_1.UserTokenSchema }]),
        ],
        controllers: [usertoken_controller_1.UsertokenController],
        providers: [usertoken_service_1.UsertokenService],
        exports: [usertoken_service_1.UsertokenService],
    })
], UsertokenModule);


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsertokenController = void 0;
const common_1 = __webpack_require__(6);
const usertoken_service_1 = __webpack_require__(54);
let UsertokenController = class UsertokenController {
    constructor(usertokenService) {
        this.usertokenService = usertokenService;
    }
};
exports.UsertokenController = UsertokenController;
exports.UsertokenController = UsertokenController = __decorate([
    (0, common_1.Controller)('usertoken'),
    __metadata("design:paramtypes", [typeof (_a = typeof usertoken_service_1.UsertokenService !== "undefined" && usertoken_service_1.UsertokenService) === "function" ? _a : Object])
], UsertokenController);


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FirebaseModule = void 0;
const common_1 = __webpack_require__(6);
const firebase_service_1 = __webpack_require__(110);
let FirebaseModule = class FirebaseModule {
};
exports.FirebaseModule = FirebaseModule;
exports.FirebaseModule = FirebaseModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [
            firebase_service_1.FirebaseService,
        ],
        exports: [
            firebase_service_1.FirebaseService,
        ],
    })
], FirebaseModule);


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolicyModule = void 0;
const common_1 = __webpack_require__(6);
const policy_controller_1 = __webpack_require__(116);
const policy_service_1 = __webpack_require__(117);
const mongoose_1 = __webpack_require__(17);
const policy_schema_1 = __webpack_require__(118);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
let PolicyModule = class PolicyModule {
};
exports.PolicyModule = PolicyModule;
exports.PolicyModule = PolicyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Policy', schema: policy_schema_1.PolicySchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
        ],
        controllers: [policy_controller_1.PolicyController],
        providers: [policy_service_1.PolicyService]
    })
], PolicyModule);


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolicyController = void 0;
const common_1 = __webpack_require__(6);
const policy_service_1 = __webpack_require__(117);
const create_policy_dto_1 = __webpack_require__(119);
const swagger_1 = __webpack_require__(13);
const abilities_guard_1 = __webpack_require__(38);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const role_schema_1 = __webpack_require__(34);
const success_response_1 = __webpack_require__(42);
const error_response_1 = __webpack_require__(41);
let PolicyController = class PolicyController {
    constructor(policyService) {
        this.policyService = policyService;
    }
    async create(createPolicyDto) {
        const data = await this.policyService.create(createPolicyDto);
        return new success_response_1.SuccessResponse({
            message: "Tạo chính sách thành công!",
            metadata: { data },
        });
    }
    async findAll() {
        const data = await this.policyService.findAll();
        return new success_response_1.SuccessResponse({
            message: "Lấy danh sách chính sách thành công!",
            metadata: { data },
        });
    }
    async update(id, updateFineDto) {
        const data = await this.policyService.update(id, updateFineDto);
        if (!data)
            return new error_response_1.NotFoundException("Không tìm thấy chính sách này!");
        return new success_response_1.SuccessResponse({
            message: "Cập nhật chính sách thành công!",
            metadata: { data },
        });
    }
    async remove(id) {
        const data = await this.policyService.remove(id);
        if (!data)
            return new error_response_1.NotFoundException("Không tìm thấy chính sách này!");
        return new success_response_1.SuccessResponse({
            message: "Xóa chính sách thành công!",
            metadata: { data },
        });
    }
};
exports.PolicyController = PolicyController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreatePolicyAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Post)("admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_policy_dto_1.CreatePolicyDto !== "undefined" && create_policy_dto_1.CreatePolicyDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], PolicyController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadPolicyAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Get)("admin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], PolicyController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdatePolicyAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof create_policy_dto_1.CreatePolicyDto !== "undefined" && create_policy_dto_1.CreatePolicyDto) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], PolicyController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeletePolicyAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], PolicyController.prototype, "remove", null);
exports.PolicyController = PolicyController = __decorate([
    (0, common_1.Controller)('policy'),
    (0, swagger_1.ApiTags)('Policy'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof policy_service_1.PolicyService !== "undefined" && policy_service_1.PolicyService) === "function" ? _a : Object])
], PolicyController);


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolicyService = void 0;
const common_1 = __webpack_require__(6);
const mongoose = __webpack_require__(18);
const policy_schema_1 = __webpack_require__(118);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let PolicyService = class PolicyService {
    constructor(policyModel) {
        this.policyModel = policyModel;
    }
    async create(createPolicyDto) {
        try {
            return await this.policyModel.create(createPolicyDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async findAll() {
        try {
            return await this.policyModel.find({});
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, updateFineDto) {
        try {
            return await this.policyModel.findByIdAndUpdate(id, updateFineDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async remove(id) {
        try {
            return await this.policyModel.findByIdAndDelete(id);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(policy_schema_1.Policy.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose !== "undefined" && mongoose.Model) === "function" ? _a : Object])
], PolicyService);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolicySchema = exports.Policy = void 0;
const mongoose_1 = __webpack_require__(17);
let Policy = class Policy {
};
exports.Policy = Policy;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Policy.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Policy.prototype, "content", void 0);
exports.Policy = Policy = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Policy);
exports.PolicySchema = mongoose_1.SchemaFactory.createForClass(Policy);


/***/ }),
/* 119 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePolicyDto = void 0;
const swagger_1 = __webpack_require__(13);
class CreatePolicyDto {
}
exports.CreatePolicyDto = CreatePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "content", void 0);


/***/ }),
/* 120 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserotpModule = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const userotp_schema_1 = __webpack_require__(32);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const userotp_service_1 = __webpack_require__(121);
const userotp_controller_1 = __webpack_require__(123);
const user_module_1 = __webpack_require__(63);
const firebase_module_1 = __webpack_require__(114);
let UserotpModule = class UserotpModule {
};
exports.UserotpModule = UserotpModule;
exports.UserotpModule = UserotpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Userotp', schema: userotp_schema_1.UserotpSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
            user_module_1.UserModule,
            firebase_module_1.FirebaseModule
        ],
        controllers: [userotp_controller_1.UserotpController],
        providers: [userotp_service_1.UserotpService],
        exports: [userotp_service_1.UserotpService],
    })
], UserotpModule);


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserotpService = void 0;
const mailer_1 = __webpack_require__(122);
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const userotp_schema_1 = __webpack_require__(32);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let UserotpService = class UserotpService {
    constructor(mailService, userotpModel) {
        this.mailService = mailService;
        this.userotpModel = userotpModel;
    }
    async sendotp(email) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await this.mailService.sendMail({
                to: email,
                from: process.env.MAIL_USER,
                subject: 'OTP',
                template: './otp',
                context: {
                    otp
                }
            });
            return otp;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async create(email, otp) {
        try {
            const userotp = await this.userotpModel.create({ email, otp });
            return userotp;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(email, otp) {
        try {
            const userotp = await this.userotpModel.updateOne({ email }, { otp });
            return userotp.modifiedCount > 0;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async findUserotpByEmail(email) {
        try {
            const userotp = await this.userotpModel.findOne({ email });
            return userotp;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async checkotp(otp, email) {
        try {
            const userotp = await this.userotpModel.findOne({ email });
            if (userotp.otp == otp) {
                return true;
            }
            return false;
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async deleteotp(email) {
        try {
            return await this.userotpModel.findOneAndDelete({ email });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.UserotpService = UserotpService;
exports.UserotpService = UserotpService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(userotp_schema_1.Userotp.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mailer_1.MailerService !== "undefined" && mailer_1.MailerService) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], UserotpService);


/***/ }),
/* 122 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs-modules/mailer");

/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserotpController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const public_decorator_1 = __webpack_require__(56);
const error_response_1 = __webpack_require__(41);
const success_response_1 = __webpack_require__(42);
const firebase_service_1 = __webpack_require__(110);
const user_service_1 = __webpack_require__(51);
const check_userotp_dto_1 = __webpack_require__(124);
const create_userotp_dto_1 = __webpack_require__(125);
const userotp_service_1 = __webpack_require__(121);
let UserotpController = class UserotpController {
    constructor(userotpService, userService, firebaseApp) {
        this.userotpService = userotpService;
        this.userService = userService;
        this.firebaseApp = firebaseApp;
        this.auth = firebaseApp.getAuth();
    }
    async sendOtp(req) {
        try {
            await this.auth.getUserByEmail(req.email);
            return new error_response_1.ConflictException('Email đã tồn tại!');
        }
        catch (err) {
            const user = await this.userService.getByEmail(req.email);
            if (user) {
                return new error_response_1.ConflictException('Email đã tồn tại!');
            }
            const otp = await this.userotpService.sendotp(req.email);
            const userotp = await this.userotpService.findUserotpByEmail(req.email);
            if (userotp?.email) {
                const data = await this.userotpService.update(req.email, otp);
                if (!data)
                    return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
                return new success_response_1.SuccessResponse({
                    message: 'Gửi mã OTP thành công!',
                    metadata: { data },
                });
            }
            else {
                const data = await this.userotpService.create(req.email, otp);
                return new success_response_1.SuccessResponse({
                    message: 'Gửi mã OTP thành công!',
                    metadata: { data },
                });
            }
        }
    }
    async checkOtp(req) {
        const result = await this.userotpService.checkotp(req.otp, req.email);
        if (result) {
            return new success_response_1.SuccessResponse({
                message: 'Xác thực thành công!',
                metadata: { data: result },
            });
        }
        return new error_response_1.NotFoundException('Mã OTP không đúng!');
    }
    async sendOtpForget(req) {
        try {
            await this.auth.getUserByEmail(req.email);
            return new error_response_1.BadRequestException('Tài khoản thuộc quyền quản lý của Google');
        }
        catch (err) {
            const user = await this.userService.getByEmail(req.email);
            if (!user) {
                return new error_response_1.NotFoundException('Không tìm thấy người dùng này!');
            }
            const otp = await this.userotpService.sendotp(req.email);
            const userotp = await this.userotpService.findUserotpByEmail(req.email);
            if (userotp) {
                const result = await this.userotpService.update(req.email, otp);
                return new success_response_1.SuccessResponse({
                    message: 'Gửi mã OTP thành công!',
                    metadata: { data: result },
                });
            }
            else {
                const result = await this.userotpService.create(req.email, otp);
                return new success_response_1.SuccessResponse({
                    message: 'Gửi mã OTP thành công!',
                    metadata: { data: result },
                });
            }
        }
    }
};
exports.UserotpController = UserotpController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('user/sendotp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof create_userotp_dto_1.CreateUserotpDto !== "undefined" && create_userotp_dto_1.CreateUserotpDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], UserotpController.prototype, "sendOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('user/checkotp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof check_userotp_dto_1.CheckUserotpDto !== "undefined" && check_userotp_dto_1.CheckUserotpDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], UserotpController.prototype, "checkOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('user/sendotp-forget'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof create_userotp_dto_1.CreateUserotpDto !== "undefined" && create_userotp_dto_1.CreateUserotpDto) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], UserotpController.prototype, "sendOtpForget", null);
exports.UserotpController = UserotpController = __decorate([
    (0, common_1.Controller)('userotp'),
    (0, swagger_1.ApiTags)('Userotp'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof userotp_service_1.UserotpService !== "undefined" && userotp_service_1.UserotpService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object, typeof (_c = typeof firebase_service_1.FirebaseService !== "undefined" && firebase_service_1.FirebaseService) === "function" ? _c : Object])
], UserotpController);


/***/ }),
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckUserotpDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class CheckUserotpDto {
}
exports.CheckUserotpDto = CheckUserotpDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof Number !== "undefined" && Number) === "function" ? _a : Object)
], CheckUserotpDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CheckUserotpDto.prototype, "email", void 0);


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserotpDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class CreateUserotpDto {
}
exports.CreateUserotpDto = CreateUserotpDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserotpDto.prototype, "email", void 0);


/***/ }),
/* 126 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");

/***/ }),
/* 127 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedsModule = void 0;
const common_1 = __webpack_require__(6);
const nestjs_command_1 = __webpack_require__(129);
const data_seed_1 = __webpack_require__(130);
const user_module_1 = __webpack_require__(63);
const role_module_1 = __webpack_require__(71);
let SeedsModule = class SeedsModule {
};
exports.SeedsModule = SeedsModule;
exports.SeedsModule = SeedsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_command_1.CommandModule,
            user_module_1.UserModule,
            role_module_1.RoleModule,
        ],
        providers: [data_seed_1.DataSeed],
        exports: [data_seed_1.DataSeed],
    })
], SeedsModule);


/***/ }),
/* 129 */
/***/ ((module) => {

"use strict";
module.exports = require("nestjs-command");

/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataSeed = void 0;
const common_1 = __webpack_require__(6);
const user_service_1 = __webpack_require__(51);
const role_service_1 = __webpack_require__(39);
const role_schema_1 = __webpack_require__(34);
const nestjs_command_1 = __webpack_require__(129);
const bcrypt = __webpack_require__(11);
const signup_dto_1 = __webpack_require__(60);
const create_role_dto_1 = __webpack_require__(73);
let DataSeed = class DataSeed {
    constructor(userService, roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }
    async hashData(data) {
        const saltOrRounds = Number(process.env.SALT_ROUNDS);
        return await bcrypt.hash(data, saltOrRounds);
    }
    async create() {
        await this.roleService.create({
            name: role_schema_1.RoleName.ADMIN
        });
        await this.roleService.create({
            name: role_schema_1.RoleName.USER
        });
        await this.roleService.create({
            name: role_schema_1.RoleName.SELLER
        });
        await this.roleService.create({
            name: role_schema_1.RoleName.MANAGER
        });
        const userInfo = new signup_dto_1.SignUpDto();
        userInfo.fullName = "admin";
        userInfo.email = process.env.EMAIL_ADMIN;
        userInfo.password = await this.hashData(process.env.PASSWORD_ADMIN);
        const user = await this.userService.create(userInfo);
        const adminRole = new create_role_dto_1.CreateRoleDto();
        adminRole.name = role_schema_1.RoleName.ADMIN;
        await this.roleService.addUserToRole(user._id, adminRole);
    }
};
exports.DataSeed = DataSeed;
__decorate([
    (0, nestjs_command_1.Command)({ command: 'create:data', describe: 'create a role and add user to role Admin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataSeed.prototype, "create", null);
exports.DataSeed = DataSeed = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _b : Object])
], DataSeed);


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionModule = void 0;
const common_1 = __webpack_require__(6);
const promotion_service_1 = __webpack_require__(132);
const promotion_controller_1 = __webpack_require__(133);
const promotion_schema_1 = __webpack_require__(29);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
let PromotionModule = class PromotionModule {
};
exports.PromotionModule = PromotionModule;
exports.PromotionModule = PromotionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Promotion', schema: promotion_schema_1.PromotionSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
        ],
        controllers: [promotion_controller_1.PromotionController],
        providers: [promotion_service_1.PromotionService],
    })
], PromotionModule);


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionService = void 0;
const common_1 = __webpack_require__(6);
const promotion_schema_1 = __webpack_require__(29);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let PromotionService = class PromotionService {
    constructor(promotionModel) {
        this.promotionModel = promotionModel;
    }
    async create(createPromotionDto) {
        try {
            return await this.promotionModel.create(createPromotionDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async findAllByProductType(productType) {
        try {
            return await this.promotionModel.find({ productType });
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, updatePromotionDto) {
        try {
            return await this.promotionModel.findByIdAndUpdate(id, updatePromotionDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async remove(id) {
        try {
            return await this.promotionModel.findByIdAndDelete(id);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(promotion_schema_1.Promotion.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], PromotionService);


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionController = void 0;
const common_1 = __webpack_require__(6);
const promotion_service_1 = __webpack_require__(132);
const create_promotion_dto_1 = __webpack_require__(134);
const abilities_guard_1 = __webpack_require__(38);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const role_schema_1 = __webpack_require__(34);
const swagger_1 = __webpack_require__(13);
const success_response_1 = __webpack_require__(42);
const error_response_1 = __webpack_require__(41);
let PromotionController = class PromotionController {
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    async create(createPromotionDto) {
        const data = await this.promotionService.create(createPromotionDto);
        return new success_response_1.SuccessResponse({
            message: "Tạo chương trình khuyến mãi thành công!",
            metadata: { data },
        });
    }
    async findAllByProductType(productType) {
        const data = await this.promotionService.findAllByProductType(productType);
        return new success_response_1.SuccessResponse({
            message: "Lấy danh sách chương trình khuyến mãi thành công!",
            metadata: { data },
        });
    }
    async update(id, updatePromotionDto) {
        const data = await this.promotionService.update(id, updatePromotionDto);
        if (!data)
            return new error_response_1.NotFoundException("Không tìm thấy chương trình khuyến mãi này!");
        return new success_response_1.SuccessResponse({
            message: "Cập nhật chương trình khuyến mãi thành công!",
            metadata: { data },
        });
    }
    async remove(id) {
        const data = await this.promotionService.remove(id);
        if (!data)
            return new error_response_1.NotFoundException("Không tìm thấy chương trình khuyến mãi này!");
        return new success_response_1.SuccessResponse({
            message: "Xóa chương trình khuyến mãi thành công!",
            metadata: { data },
        });
    }
};
exports.PromotionController = PromotionController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreatePromotionAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Post)("manager"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_promotion_dto_1.CreatePromotionDto !== "undefined" && create_promotion_dto_1.CreatePromotionDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], PromotionController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadPromotionAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Get)('manager'),
    (0, swagger_1.ApiQuery)({ name: 'productType', type: String, required: false }),
    __param(0, (0, common_1.Query)('productType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], PromotionController.prototype, "findAllByProductType", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdatePromotionAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Put)('manager/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof create_promotion_dto_1.CreatePromotionDto !== "undefined" && create_promotion_dto_1.CreatePromotionDto) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], PromotionController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeletePromotionAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.MANAGER),
    (0, common_1.Delete)('manager/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], PromotionController.prototype, "remove", null);
exports.PromotionController = PromotionController = __decorate([
    (0, common_1.Controller)('promotion'),
    (0, swagger_1.ApiTags)('Promotion'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof promotion_service_1.PromotionService !== "undefined" && promotion_service_1.PromotionService) === "function" ? _a : Object])
], PromotionController);


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePromotionDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class CreatePromotionDto {
}
exports.CreatePromotionDto = CreatePromotionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "promotionName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "days", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreatePromotionDto.prototype, "productTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], CreatePromotionDto.prototype, "status", void 0);


/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FineModule = void 0;
const common_1 = __webpack_require__(6);
const fine_service_1 = __webpack_require__(136);
const fine_controller_1 = __webpack_require__(138);
const mongoose_1 = __webpack_require__(17);
const ability_module_1 = __webpack_require__(64);
const role_module_1 = __webpack_require__(71);
const fine_shema_1 = __webpack_require__(137);
let FineModule = class FineModule {
};
exports.FineModule = FineModule;
exports.FineModule = FineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Fine', schema: fine_shema_1.FineSchema }]),
            ability_module_1.AbilityModule,
            role_module_1.RoleModule,
        ],
        controllers: [fine_controller_1.FineController],
        providers: [fine_service_1.FineService],
    })
], FineModule);


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FineService = void 0;
const common_1 = __webpack_require__(6);
const fine_shema_1 = __webpack_require__(137);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
const InternalServerErrorExceptionCustom_exception_1 = __webpack_require__(40);
let FineService = class FineService {
    constructor(fineModel) {
        this.fineModel = fineModel;
    }
    async create(createFineDto) {
        try {
            return await this.fineModel.create(createFineDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async findAll() {
        try {
            return await this.fineModel.find({});
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async update(id, updateFineDto) {
        try {
            return await this.fineModel.findByIdAndUpdate(id, updateFineDto);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
    async remove(id) {
        try {
            return await this.fineModel.findByIdAndDelete(id);
        }
        catch (err) {
            if (err instanceof mongoose_2.MongooseError)
                throw new InternalServerErrorExceptionCustom_exception_1.InternalServerErrorExceptionCustom();
            throw err;
        }
    }
};
exports.FineService = FineService;
exports.FineService = FineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fine_shema_1.Fine.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], FineService);


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FineSchema = exports.Fine = void 0;
const mongoose_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(20);
const mongoose_2 = __webpack_require__(18);
let Fine = class Fine extends mongoose_2.Document {
};
exports.Fine = Fine;
__decorate([
    (0, mongoose_1.Prop)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], Fine.prototype, "times", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Fine.prototype, "content", void 0);
exports.Fine = Fine = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Fine);
exports.FineSchema = mongoose_1.SchemaFactory.createForClass(Fine);


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FineController = void 0;
const common_1 = __webpack_require__(6);
const fine_service_1 = __webpack_require__(136);
const create_fine_dto_1 = __webpack_require__(139);
const swagger_1 = __webpack_require__(13);
const abilities_guard_1 = __webpack_require__(38);
const abilities_decorator_1 = __webpack_require__(15);
const role_decorator_1 = __webpack_require__(37);
const role_schema_1 = __webpack_require__(34);
const success_response_1 = __webpack_require__(42);
const error_response_1 = __webpack_require__(41);
let FineController = class FineController {
    constructor(fineService) {
        this.fineService = fineService;
    }
    async create(createFineDto) {
        const data = await this.fineService.create(createFineDto);
        return new success_response_1.SuccessResponse({
            message: "Tạo chính sách thành công!",
            metadata: { data },
        });
    }
    async findAll() {
        const data = await this.fineService.findAll();
        return new success_response_1.SuccessResponse({
            message: "Lấy danh sách chính sách thành công!",
            metadata: { data },
        });
    }
    async update(id, updateFineDto) {
        const result = await this.fineService.update(id, updateFineDto);
        if (!result)
            return new error_response_1.NotFoundException("Không tìm thấy chính sách này!");
        return new success_response_1.SuccessResponse({
            message: "Cập nhật chính sách thành công!",
            metadata: { data: result },
        });
    }
    async remove(id) {
        const result = await this.fineService.remove(id);
        if (!result)
            return new error_response_1.NotFoundException("Không tìm thấy chính sách này!");
        return new success_response_1.SuccessResponse({
            message: "Xóa chính sách thành công!",
            metadata: { data: result },
        });
    }
};
exports.FineController = FineController;
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.CreateFineAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Post)("admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_fine_dto_1.CreateFineDto !== "undefined" && create_fine_dto_1.CreateFineDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], FineController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.ReadFineAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Get)("admin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], FineController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.UpdateFineAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof create_fine_dto_1.CreateFineDto !== "undefined" && create_fine_dto_1.CreateFineDto) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], FineController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(abilities_guard_1.AbilitiesGuard),
    (0, abilities_decorator_1.CheckAbilities)(new abilities_decorator_1.DeleteFineAbility()),
    (0, role_decorator_1.CheckRole)(role_schema_1.RoleName.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], FineController.prototype, "remove", null);
exports.FineController = FineController = __decorate([
    (0, common_1.Controller)('fine'),
    (0, swagger_1.ApiTags)('Fine'),
    (0, swagger_1.ApiBearerAuth)('Authorization'),
    __metadata("design:paramtypes", [typeof (_a = typeof fine_service_1.FineService !== "undefined" && fine_service_1.FineService) === "function" ? _a : Object])
], FineController);


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateFineDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(20);
class CreateFineDto {
}
exports.CreateFineDto = CreateFineDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateFineDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFineDto.prototype, "content", void 0);


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryModule = void 0;
const common_1 = __webpack_require__(6);
const cloudinary_provider_1 = __webpack_require__(141);
const cloudinary_service_1 = __webpack_require__(143);
const cloudinary_controller_1 = __webpack_require__(145);
let CloudinaryModule = class CloudinaryModule {
};
exports.CloudinaryModule = CloudinaryModule;
exports.CloudinaryModule = CloudinaryModule = __decorate([
    (0, common_1.Module)({
        controllers: [cloudinary_controller_1.CloudinaryController],
        providers: [cloudinary_provider_1.CloudinaryProvider, cloudinary_service_1.CloudinaryService],
        exports: [cloudinary_provider_1.CloudinaryProvider, cloudinary_service_1.CloudinaryService]
    })
], CloudinaryModule);


/***/ }),
/* 141 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryProvider = void 0;
const cloudinary_1 = __webpack_require__(142);
exports.CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        return cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    },
};


/***/ }),
/* 142 */
/***/ ((module) => {

"use strict";
module.exports = require("cloudinary");

/***/ }),
/* 143 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryService = void 0;
const common_1 = __webpack_require__(6);
const cloudinary_1 = __webpack_require__(142);
const streamifier = __webpack_require__(144);
let CloudinaryService = class CloudinaryService {
    uploadFile(file) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: 'TLCN' }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);


/***/ }),
/* 144 */
/***/ ((module) => {

"use strict";
module.exports = require("streamifier");

/***/ }),
/* 145 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryController = void 0;
const common_1 = __webpack_require__(6);
const platform_express_1 = __webpack_require__(146);
const swagger_1 = __webpack_require__(13);
const public_decorator_1 = __webpack_require__(56);
const cloudinary_service_1 = __webpack_require__(143);
const success_response_1 = __webpack_require__(42);
let CloudinaryController = class CloudinaryController {
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    async uploadImage(file) {
        const result = await this.cloudinaryService.uploadFile(file);
        return new success_response_1.SuccessResponse({
            message: 'Upload file thành công!',
            metadata: { data: result },
        });
    }
};
exports.CloudinaryController = CloudinaryController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The file has been uploaded successfully to cloudinary',
    }),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CloudinaryController.prototype, "uploadImage", null);
exports.CloudinaryController = CloudinaryController = __decorate([
    (0, common_1.Controller)('upload'),
    (0, swagger_1.ApiTags)('Upload'),
    __metadata("design:paramtypes", [typeof (_a = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _a : Object])
], CloudinaryController);


/***/ }),
/* 146 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");

/***/ }),
/* 147 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(17);
const database_service_1 = __webpack_require__(148);
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: (configService) => ({
                    uri: configService.get('NODE_ENV') === 'test'
                        ? (configService.get('DB_URI_TEST'))
                        : (configService.get('DB_URI_PRODUCTION'))
                }),
                inject: [config_1.ConfigService]
            }),
        ],
        providers: [database_service_1.DatabaseService],
        exports: [database_service_1.DatabaseService]
    })
], DatabaseModule);


/***/ }),
/* 148 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(17);
const mongoose_2 = __webpack_require__(18);
let DatabaseService = class DatabaseService {
    constructor(connection) {
        this.connection = connection;
    }
    getDbHandle() {
        return this.connection;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Connection !== "undefined" && mongoose_2.Connection) === "function" ? _a : Object])
], DatabaseService);


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDocument = void 0;
const swagger_1 = __webpack_require__(13);
const swagger_config_1 = __webpack_require__(150);
function createDocument(app) {
    const builder = new swagger_1.DocumentBuilder()
        .setTitle(swagger_config_1.SWAGGER_CONFIG.title)
        .setDescription(swagger_config_1.SWAGGER_CONFIG.description)
        .setVersion(swagger_config_1.SWAGGER_CONFIG.version)
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Authorization');
    for (const tag of swagger_config_1.SWAGGER_CONFIG.tags) {
        builder.addTag(tag);
    }
    const option = {
        operationIdFactory: (controllerKey, methodKey) => methodKey
    };
    const builds = builder.build();
    return swagger_1.SwaggerModule.createDocument(app, builds, option);
}
exports.createDocument = createDocument;


/***/ }),
/* 150 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SWAGGER_CONFIG = void 0;
exports.SWAGGER_CONFIG = {
    title: "Web DTEx",
    description: "The website for exchanging and buying/selling used items.",
    version: "1.0",
    tags: []
};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("49dda6b540542742ae08")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;