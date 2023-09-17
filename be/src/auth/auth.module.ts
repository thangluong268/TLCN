import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { JwtATStrategy } from './strategies/jwt-at.strategy';
import { JwtRTStrategy } from './strategies/jwt-rt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTokenSchema } from './schema/usertoken.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtATAuthGuard } from './guards/jwt-at-auth.guard';
import { TestAuthGuard } from './guards/test.guard';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       secret: config.get<string>('JWT_SECRET'),
    //       signOptions: {
    //         expiresIn: config.get<string | number>('JWT_EXPIRES'),
    //       },
    //     }
    //   },
    // }),
    MongooseModule.forFeature([{ name: 'UserToken', schema: UserTokenSchema }]),
    JwtModule.register({}),
    UserModule,
    PassportModule,
    RoleModule,
    AbilityModule,
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtATStrategy,
    JwtRTStrategy,
    {
      provide: APP_GUARD,
      useClass: TestAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}