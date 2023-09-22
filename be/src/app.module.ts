import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PolicyModule } from './policy/policy.module';
import { RoleModule } from './role/role.module';
import { AbilityModule } from './ability/ability.module';
import { FirebaseModule } from './firebase/firebase.module';
import { BillModule } from './bill/bill.module';
import { UsertokenModule } from './usertoken/usertoken.module';
import { CartModule } from './cart/cart.module';
import { StoreModule } from './store/store.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ProductModule } from './product/product.module';
import { SeedsModule } from './seeds/seeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI, { dbName: "ReduxAndAuth" }),
    UserModule,
    AuthModule,
    PolicyModule,
    RoleModule,
    AbilityModule,
    FirebaseModule,
    BillModule,
    UsertokenModule,
    CartModule,
    StoreModule,
    FeedbackModule,
    ProductModule,
    SeedsModule,
  ],
})
export class AppModule { }
