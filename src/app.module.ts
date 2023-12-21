import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AbilityModule } from './ability/ability.module';
import { AuthModule } from './auth/auth.module';
import { BillModule } from './bill/bill.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DatabaseModule } from './database/database.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FineModule } from './fine/fine.module';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationModule } from './notification/notification.module';
import { PolicyModule } from './policy/policy.module';
import { ProductModule } from './product/product.module';
import { PromotionModule } from './promotion/promotion.module';
import { ReportModule } from './report/report.module';
import { RoleModule } from './role/role.module';
import { SeedsModule } from './seeds/seeds.module';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';
import { UserotpModule } from './userotp/userotp.module';
import { UsertokenModule } from './usertoken/usertoken.module';
// import { CanActiveMiddleware } from './middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
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
          dir: join(__dirname, 'src/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    PolicyModule,
    RoleModule,
    AbilityModule,
    FirebaseModule,
    BillModule,
    UsertokenModule,
    UserotpModule,
    CartModule,
    StoreModule,
    FeedbackModule,
    ProductModule,
    SeedsModule,
    EvaluationModule,
    NotificationModule,
    PromotionModule,
    FineModule,
    CategoryModule,
    CloudinaryModule,
    ReportModule,
  ],
  providers: [],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(CanActiveMiddleware).forRoutes('*');
//   }
// }
