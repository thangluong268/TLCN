import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<User>{
        const {password, ...info} = signUpDto
        const saltOrRounds = Number(process.env.SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, saltOrRounds)
        signUpDto.password = hashedPassword
        const newUser = await this.userService.create(signUpDto)
        return newUser
    }

    async login(loginDto: LoginDto): Promise<{token: string}>{
        const {email, password} = loginDto
        const user = await this.userService.getByEmail(email)
        if(!user){
            throw new UnauthorizedException("Invalid email or password")
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if(!isPasswordMatched){
            throw new UnauthorizedException("Invalid email or password")
        }
        const payload = {userId: user._id}
        const token = await this.jwtService.signAsync(payload)
        return {token}
    }
}
