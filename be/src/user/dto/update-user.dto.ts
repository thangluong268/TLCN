import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty()
    avatar: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    gender: string;

    @ApiProperty({ type: Date })
    birthday: Date;

    @ApiProperty()
    status: boolean;

}


