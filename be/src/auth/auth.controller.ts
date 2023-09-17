import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/user/schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { RoleName } from 'src/role/schema/role.schema';
import { TokensDto } from './dto/tokens.dto';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { JwtATAuthGuard } from './guards/jwt-at-auth.guard';
import { CheckAbilities, CreateUserAbility, ManageUserTokenAbility, ReadRoleAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('Authorization')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService
    ) {}

  @Public()
  @Post('signup')
  async signUp(
    @Body()
    signUpDto: SignUpDto,
  ) : Promise<User> {
    const newUser = await this.authService.signUp(signUpDto)
    // await this.roleService.addUserToRole(String(newUser._id), {name: RoleName.USER})
    return newUser
  }

  @Public()
  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
  ) : Promise<TokensDto> {
    return await this.authService.login(loginDto)
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ManageUserTokenAbility())
  @Delete('logout')
  async logout(
    @Req() req: Request
  ) : Promise<boolean> {
    console.log(req.user)
    return await this.authService.logout(req.user['userId'])
  }

  @Public()
  @UseGuards(JwtRTAuthGuard, AbilitiesGuard)
  @CheckAbilities(new ManageUserTokenAbility())
  @Post('refresh')
  async refreshToken(
    @Req() req: Request
  ) : Promise<TokensDto> {
    return await this.authService.refreshToken(req.user['userId'], req.user['refreshToken'])
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateUserAbility())
  @Post('createUser')
  async createUser(
    @Body()
    signUpDto: SignUpDto,
  ) : Promise<User> {
    const newUser = await this.authService.signUp(signUpDto)
    return newUser
  }
}
