import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as firebase from 'firebase-admin';
import { Public } from '../auth/decorators/public.decorator';
import { BadRequestException, ConflictException, NotFoundException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { CheckUserotpDto } from './dto/check-userotp.dto';
import { CreateUserotpDto } from './dto/create-userotp.dto';
import { UserotpService } from './userotp.service';

@Controller('userotp')
@ApiTags('Userotp')
@ApiBearerAuth('Authorization')
export class UserotpController {
  private auth: firebase.auth.Auth;
  constructor(
    private readonly userotpService: UserotpService,
    private readonly userService: UserService,
    private firebaseApp: FirebaseService,
  ) {
    this.auth = firebaseApp.getAuth();
  }

  @Public()
  @Post('user/sendotp')
  async sendOtp(@Body() req: CreateUserotpDto): Promise<SuccessResponse | NotFoundException | ConflictException> {
    try {
      await this.auth.getUserByEmail(req.email);
      return new ConflictException('Email đã tồn tại!');
    } catch (err) {
      const user = await this.userService.getByEmail(req.email);
      if (user) {
        return new ConflictException('Email đã tồn tại!');
      }
      const otp = await this.userotpService.sendotp(req.email);
      const userotp = await this.userotpService.findUserotpByEmail(req.email);
      if (userotp?.email) {
        const data = await this.userotpService.update(req.email, otp);
        if (!data) return new NotFoundException('Không tìm thấy người dùng này!');
        return new SuccessResponse({
          message: 'Gửi mã OTP thành công!',
          metadata: { data },
        });
      } else {
        const data = await this.userotpService.create(req.email, otp);
        return new SuccessResponse({
          message: 'Gửi mã OTP thành công!',
          metadata: { data },
        });
      }
    }
  }

  @Public()
  @Post('user/checkotp')
  async checkOtp(@Body() req: CheckUserotpDto): Promise<SuccessResponse | NotFoundException> {
    const result = await this.userotpService.checkotp(req.otp, req.email);
    if (result) {
      return new SuccessResponse({
        message: 'Xác thực thành công!',
        metadata: { data: result },
      });
    }
    return new NotFoundException('Mã OTP không đúng!');
  }

  @Public()
  @Post('user/sendotp-forget')
  async sendOtpForget(@Body() req: CreateUserotpDto): Promise<SuccessResponse | NotFoundException | BadRequestException> {
    try {
      await this.auth.getUserByEmail(req.email);
      return new BadRequestException('Tài khoản thuộc quyền quản lý của Google');
    } catch (err) {
      const user = await this.userService.getByEmail(req.email);
      if (!user) {
        return new NotFoundException('Không tìm thấy người dùng này!');
      }
      const otp = await this.userotpService.sendotp(req.email);
      const userotp = await this.userotpService.findUserotpByEmail(req.email);
      if (userotp) {
        const result = await this.userotpService.update(req.email, otp);
        return new SuccessResponse({
          message: 'Gửi mã OTP thành công!',
          metadata: { data: result },
        });
      } else {
        const result = await this.userotpService.create(req.email, otp);
        return new SuccessResponse({
          message: 'Gửi mã OTP thành công!',
          metadata: { data: result },
        });
      }
    }
  }
}
