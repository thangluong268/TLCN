import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UserToken } from './schema/usertoken.schema';
import mongoose, { Model } from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { RoleName } from 'src/role/schema/role.schema';
import { ForbiddenExceptionCustom } from 'src/exceptions/ForbiddenExceptionCustom.exception';
import { UnauthorizedExceptionCustom } from 'src/exceptions/UnauthorizedExceptionCustom.exception';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserToken.name)
        private readonly userTokenModel: Model<UserToken>,
        private readonly roleService: RoleService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async getTokens(payload: any): Promise<TokensDto> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
            }),
        ])
        return {
            accessToken: at,
            refreshToken: rt,
        }
    }

    async hashData(data: string): Promise<string> {
        const saltOrRounds = Number(process.env.SALT_ROUNDS)
        return await bcrypt.hash(data, saltOrRounds)
    }

    async createUserToken(userId: string, refreshToken: string): Promise<UserToken> {
        const hashedRT = await this.hashData(refreshToken)
        const userToken = await this.userTokenModel.create({
            userId,
            hashedRefreshToken: hashedRT,
        })
        return userToken
    }

    async updateUserToken(userId: string, refreshToken: string): Promise<boolean> {
        const hashedRT = await this.hashData(refreshToken)
        const userToken = await this.userTokenModel.findOneAndUpdate(
            { userId },
            { hashedRefreshToken: hashedRT },
            { new: true },
        )
        if (!userToken) { throw new ForbiddenExceptionCustom() }
        return true
    }

    async deleteUserToken(userId: string): Promise<boolean> {
        const userToken = await this.userTokenModel.findOneAndDelete({ userId })
        if (!userToken) { throw new ForbiddenExceptionCustom() }
        return true
    }

    async getUserTokenById(userId: string): Promise<any> {
        const userToken = await this.userTokenModel.findOne({ userId })
        return userToken
    }


    async signUp(signUpDto: SignUpDto): Promise<User> {
        const hashedPassword = await this.hashData(signUpDto.password)
        signUpDto.password = hashedPassword
        const newUser = await this.userService.create(signUpDto)
        const tokens = await this.getTokens({ userId: newUser._id })
        await this.createUserToken(newUser._id, tokens.refreshToken)
        await this.roleService.addUserToRole(newUser._id, { name: RoleName.USER })
        return newUser
    }

    async login(loginDto: LoginDto): Promise<TokensDto> {
        const { email, password } = loginDto
        const user = await this.userService.getByEmail(email)
        if (!user) {
            throw new UnauthorizedExceptionCustom()
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) {
            throw new UnauthorizedExceptionCustom()
        }
        const payload = { userId: user._id }
        const tokens = await this.getTokens(payload)
        const userToken = await this.getUserTokenById(user._id)
        userToken ? await this.updateUserToken(user._id, tokens.refreshToken)
            : await this.createUserToken(user._id, tokens.refreshToken)
        return tokens
    }

    async logout(userId: string): Promise<boolean> {
        return await this.deleteUserToken(userId)
    }

    async refreshToken(userId: string, refreshToken: string): Promise<TokensDto> {
        const userToken = await this.getUserTokenById(userId)
        if (!userToken) { throw new ForbiddenExceptionCustom() }
        const rtMatches = await bcrypt.compare(refreshToken, userToken.hashedRefreshToken)
        if (!rtMatches) { throw new ForbiddenExceptionCustom() }
        const payload = { userId: userToken.userId }
        const tokens = await this.getTokens(payload)
        await this.updateUserToken(userToken.userId, tokens.refreshToken)
        return tokens
    }

    async createUser(signUpDto: SignUpDto): Promise<User> {
        const hashedPassword = await this.hashData(signUpDto.password)
        signUpDto.password = hashedPassword
        const newUser = await this.userService.create(signUpDto)
        const tokens = await this.getTokens({ userId: newUser._id })
        await this.createUserToken(newUser._id, tokens.refreshToken)
        return newUser
    }


}
