import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, Length, MinLength } from 'class-validator';

export class SeedUserDto {
  @ApiProperty()
  @IsNotEmpty()
  avatar: string;
  
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  @Length(10)
  phone: string;
}

export class SeedStoreDto {
  @ApiProperty()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  phoneNumber: string[];
}

export class SeedProductDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  avatar: string[];

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  productName: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  keywords: string[];

  @ApiProperty()
  @IsNotEmpty()
  storeId: string;
}

export class SeedDto {
  @Type(() => SeedUserDto)
  @ApiProperty({ type: [SeedUserDto] })
  @IsNotEmpty()
  users: SeedUserDto[];

  @Type(() => SeedStoreDto)
  @ApiProperty({ type: [SeedStoreDto] })
  @IsNotEmpty()
  stores: SeedStoreDto[];
}
