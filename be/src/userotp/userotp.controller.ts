import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UserotpService } from './userotp.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateUserotpAbility } from 'src/ability/decorators/abilities.decorator';
import { Userotp } from './schema/userotp.schema';
import { Types } from 'mongoose';
import { CreateUserotpDto } from './dto/create-userotp.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CheckUserotpDto } from './dto/check-userotp.dto';

@Controller('userotp')
@ApiTags('Userotp')
@ApiBearerAuth('Authorization')
export class UserotpController {
  constructor(private readonly userotpService: UserotpService) { }

  @Public()
  @Post('user/sendotp')
  async sendOtp(@Body() req: CreateUserotpDto): Promise<void> {
    const otp = await this.userotpService.sendotp(req.email);
    const userotp = await this.userotpService.findUserotpByEmail(req.email);
    if (userotp.email) {
      await this.userotpService.update(req.email, otp);
    } else {
      await this.userotpService.create(req.email, otp);
    }
  }

  @Public()
  @Post('user/checkotp')
  async checkOtp(@Body() req: CheckUserotpDto): Promise<void> {
    const otp = await this.userotpService.checkotp(req.otp, req.email);
  }
}
