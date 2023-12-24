import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  status: boolean = true;
}
