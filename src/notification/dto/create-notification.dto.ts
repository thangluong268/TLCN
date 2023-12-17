import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SubNoti } from './sub-notification.dto';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  userIdFrom: string;

  @ApiProperty()
  @IsNotEmpty()
  userIdTo: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  sub: SubNoti;
}
