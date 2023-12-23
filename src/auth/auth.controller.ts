/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Body, Controller, Delete, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CheckAbilities, CreateUserAbility, ManageUserTokenAbility } from '../ability/decorators/abilities.decorator';
import { CheckRole } from '../ability/decorators/role.decorator';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { BadRequestException, ConflictException, ForbiddenException } from '../core/error.response';
import { SuccessResponse } from '../core/success.response';
import { EvaluationService } from '../evaluation/evaluation.service';
import { ProductService } from '../product/product.service';
import { ErrorResponseDto } from '../responses/error.responseDto';
import { SuccessResponseDto } from '../responses/success.responseDto';
import { RoleService } from '../role/role.service';
import { RoleName } from '../role/schema/role.schema';
import { StoreService } from '../store/store.service';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { UsertokenService } from '../usertoken/usertoken.service';
import { AuthService } from './auth.service';
import { GetCurrentUserId } from './decorators/get-current-userid.decorator';
import { Public } from './decorators/public.decorator';
import { LoginSocialDto } from './dto/login-social.dto';
import { LoginDto } from './dto/login.dto';
import { SeedDto, SeedProductDto } from './dto/seed.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('Authorization')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly userTokenService: UsertokenService,
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
    private readonly evaluationService: EvaluationService,
  ) {}

  @Public()
  @Post('login-social')
  async loginSocial(
    @Body()
    loginSocialDto: LoginSocialDto,
  ): Promise<SuccessResponse | BadRequestException> {
    const userSocial: User = await this.userService.getByEmailAndSocial(loginSocialDto.email, true);

    let newUser: User;

    if (!userSocial) {
      const user: User = await this.userService.getByEmailAndSocial(loginSocialDto.email, false);
      if (user) return new BadRequestException('Tài khoản hiện tại không khả dụng!');

      const hashedPassword = await this.authService.hashData(loginSocialDto.password);
      loginSocialDto.password = hashedPassword;
      newUser = await this.userService.createSocial(loginSocialDto);

      const resultAddRole = await this.roleService.addUserToRole(newUser._id, {
        name: RoleName.USER,
      });

      if (!resultAddRole) return new BadRequestException('Tài khoản hiện tại không khả dụng!');
    }

    const { password, ...userWithoutPass } = userSocial ? userSocial['_doc'] : newUser['_doc'];

    const isMatch = await this.authService.compareData(loginSocialDto.password, password);
    if (!isMatch) return new BadRequestException('Tài khoản hiện tại không khả dụng!');

    const userId = userSocial ? userSocial._id : newUser._id;

    const payload = { userId };
    const tokens = await this.authService.getTokens(payload);
    const userToken = await this.userTokenService.getUserTokenById(userId);
    userToken
      ? await this.userTokenService.updateUserToken(userId, tokens.refreshToken)
      : await this.userTokenService.createUserToken(userId, tokens.refreshToken);


    const role = await this.roleService.getRoleNameByUserId(userId);

    return new SuccessResponse({
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

  @Public()
  @Post('signup')
  async signUp(
    @Body()
    signUpDto: SignUpDto,
  ): Promise<SuccessResponse | BadRequestException | ConflictException> {
    const user: User = await this.userService.getByEmail(signUpDto.email);
    if (user) return new ConflictException('Email đã tồn tại!');

    const hashedPassword = await this.authService.hashData(signUpDto.password);
    signUpDto.password = hashedPassword;
    const newUser = await this.userService.createNormal(signUpDto);
    const payload = { userId: newUser._id };
    const tokens = await this.authService.getTokens(payload);
    await this.userTokenService.createUserToken(newUser._id, tokens.refreshToken);
    const resultAddRole = await this.roleService.addUserToRole(newUser._id, {
      name: RoleName.USER,
    });
    if (!resultAddRole) return new BadRequestException('Không thể tạo user này!');
    return new SuccessResponse({
      message: 'Đăng ký thành công!',
      metadata: { data: newUser },
    });
  }

  @Public()
  @Post('login')
  @ApiResponse({ status: HttpStatus.OK, description: 'Get list users', type: SuccessResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid user data', type: ErrorResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<SuccessResponse | BadRequestException> {
    const user = await this.userService.getByEmail(loginDto.email);
    if (!user) return new BadRequestException('Email hoặc mật khẩu không chính xác!');
    const { password, ...userWithoutPass } = user['_doc'];

    const isMatch = await this.authService.compareData(loginDto.password, password);
    if (!isMatch) return new BadRequestException('Email hoặc mật khẩu không chính xác!');
    const payload = { userId: user._id };
    const tokens = await this.authService.getTokens(payload);
    const userToken = await this.userTokenService.getUserTokenById(user._id);
    userToken
      ? await this.userTokenService.updateUserToken(user._id, tokens.refreshToken)
      : await this.userTokenService.createUserToken(user._id, tokens.refreshToken);

    const role = await this.roleService.getRoleNameByUserId(user._id);

    return new SuccessResponse({
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

  @Public()
  @Post('forgetPassword')
  async forgetPassword(
    @Body()
    loginDto: LoginDto,
  ): Promise<SuccessResponse> {
    const { email, password } = loginDto;
    const hashedPassword = await this.authService.hashData(password);
    const user = await this.userService.updatePassword(email, hashedPassword);
    return new SuccessResponse({
      message: 'Lấy lại mật khẩu thành công!',
      metadata: { data: user.email },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ManageUserTokenAbility())
  @CheckRole(RoleName.USER, RoleName.SELLER, RoleName.MANAGER_PRODUCT, RoleName.MANAGER_STORE, RoleName.MANAGER_USER, RoleName.ADMIN)
  @Delete('logout')
  async logout(@GetCurrentUserId() userId: string): Promise<SuccessResponse | ForbiddenException> {
    const result = await this.userTokenService.deleteUserToken(userId);
    if (!result) return new ForbiddenException('Không thể đăng xuất!');
    return new SuccessResponse({
      message: 'Đăng xuất thành công!',
      metadata: { data: result },
    });
  }

  @Public()
  @UseGuards(JwtRTAuthGuard, AbilitiesGuard)
  @CheckAbilities(new ManageUserTokenAbility())
  @Post('refresh')
  async refreshToken(@GetCurrentUserId() userId: string, @Req() req: Request): Promise<SuccessResponse | ForbiddenException> {
    const refreshToken = req.user['refreshToken'];
    const userToken = await this.userTokenService.getUserTokenById(userId);
    await this.authService.compareData(refreshToken, userToken.hashedRefreshToken);
    const payload = { userId: userToken.userId };
    const tokens = await this.authService.getTokens(payload);
    const result = await this.userTokenService.updateUserToken(userToken.userId, tokens.refreshToken);
    if (!result) return new ForbiddenException('Không thể tạo token mới!');
    return new SuccessResponse({
      message: 'Tạo token mới thành công!',
      metadata: { data: tokens },
    });
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateUserAbility())
  @CheckRole(RoleName.ADMIN)
  @Post('createUser')
  async createUser(
    @Body()
    signUpDto: SignUpDto,
  ): Promise<SuccessResponse> {
    const hashedPassword = await this.authService.hashData(signUpDto.password);
    signUpDto.password = hashedPassword;
    const newUser = await this.userService.createNormal(signUpDto);
    const payload = { userId: newUser._id };
    const tokens = await this.authService.getTokens(payload);
    await this.userTokenService.createUserToken(newUser._id, tokens.refreshToken);
    return new SuccessResponse({
      message: 'Đăng ký thành công!',
      metadata: { data: newUser },
    });
  }

  @Public()
  @ApiBody({ type: SeedDto })
  @Post('create-multi-users')
  async createMultiUsers(@Body() seedDto: SeedDto): Promise<SuccessResponse | BadRequestException> {
    // Create multi users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataUsers: any = await Promise.all(
      seedDto.users.map(async user => {
        let hashedPassword = await this.authService.hashData(user.password);
        user.password = hashedPassword;
        let newUser: any = await this.userService.createNormal(user);
        let payload = { userId: newUser._id };
        let tokens = await this.authService.getTokens(payload);
        await this.userTokenService.createUserToken(newUser._id, tokens.refreshToken);
        let resultAddRole = await this.roleService.addUserToRole(newUser._id, { name: RoleName.USER });
        if (!resultAddRole) return new BadRequestException('Không thể tạo user này!');
        return newUser;
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userIds = dataUsers.map((user: any) => user._id);

    // Create multi stores
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataStores: any = await Promise.all(
      seedDto.stores.map(async (store, index) => {
        store.phoneNumber = [dataUsers[index].phone];
        let newStore = await this.storeService.create(userIds[index], store);
        await this.roleService.addUserToRole(userIds[index], {
          name: RoleName.SELLER,
        });
        return newStore;
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storeIds = dataStores.map((store: any) => store._id);

    return new SuccessResponse({
      message: 'Tạo nhiều data thành công!',
      metadata: { userIds, storeIds },
    });
  }

  @Public()
  @ApiBody({ type: [SeedProductDto] })
  @Post('create-multi-products')
  async createMultiProducts(@Body() seedProductDto: SeedProductDto[]): Promise<SuccessResponse | BadRequestException> {
    // Create multi products
    const productIds: string[] = await Promise.all(
      seedProductDto.map(async (product: SeedProductDto) => {
        const { storeId, ...productData } = product;
        const newProduct = await this.productService.create(storeId, productData);
        await this.evaluationService.create(newProduct._id);
        return newProduct._id.toString();
      }),
    );

    return new SuccessResponse({
      message: 'Tạo nhiều data thành công!',
      metadata: { productIds },
    });
  }
}
