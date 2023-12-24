import { ApiProperty } from '@nestjs/swagger';


export class UpdateStoreDto {
  @ApiProperty()
  avatar: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: [String] })
  phoneNumber: string[];
}
