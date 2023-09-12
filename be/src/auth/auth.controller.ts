import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/user/schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { RoleName } from 'src/role/schema/role.schema';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('Authorization')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService
    ) {}

  @Post('signup')
  async signUp(
    @Body()
    signUpDto: SignUpDto,
  ) : Promise<User> {
    const newUser = await this.authService.signUp(signUpDto)
    await this.roleService.addUserToRole(String(newUser._id), {name: RoleName.USER})
    return newUser
  }

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
  ) : Promise<{token: string}> {
    return await this.authService.login(loginDto)
  }

  @Post('createUser')
  async createUser(
    @Body()
    signUpDto: SignUpDto,
  ) : Promise<User> {
    const newUser = await this.authService.signUp(signUpDto)
    return newUser
  }
}
