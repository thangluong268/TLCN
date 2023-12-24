import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AbilityModule } from '../ability/ability.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { ProductModule } from '../product/product.module';
import { RoleModule } from '../role/role.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { UsertokenModule } from '../usertoken/usertoken.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtATAuthGuard } from './guards/jwt-at-auth.guard';
import { JwtATStrategy } from './strategies/jwt-at.strategy';
import { JwtRTStrategy } from './strategies/jwt-rt.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    PassportModule,
    RoleModule,
    AbilityModule,
    UsertokenModule,
    FirebaseModule,
    StoreModule,
    ProductModule,
    EvaluationModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtATStrategy,
    JwtRTStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtATAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
