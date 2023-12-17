"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const policy_module_1 = require("./policy/policy.module");
const role_module_1 = require("./role/role.module");
const ability_module_1 = require("./ability/ability.module");
const bill_module_1 = require("./bill/bill.module");
const usertoken_module_1 = require("./usertoken/usertoken.module");
const user_module_1 = require("./user/user.module");
const firebase_module_1 = require("./firebase/firebase.module");
const userotp_module_1 = require("./userotp/userotp.module");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = require("path");
const mailer_1 = require("@nestjs-modules/mailer");
const cart_module_1 = require("./cart/cart.module");
const store_module_1 = require("./store/store.module");
const feedback_module_1 = require("./feedback/feedback.module");
const product_module_1 = require("./product/product.module");
const seeds_module_1 = require("./seeds/seeds.module");
const evaluation_module_1 = require("./evaluation/evaluation.module");
const notification_module_1 = require("./notification/notification.module");
const promotion_module_1 = require("./promotion/promotion.module");
const fine_module_1 = require("./fine/fine.module");
const category_module_1 = require("./category/category.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const database_module_1 = require("./database/database.module");
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
//# sourceMappingURL=app.module.js.map