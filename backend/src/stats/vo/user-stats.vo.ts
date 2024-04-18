import { ApiProperty } from '@nestjs/swagger';

export class UserStats {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  bookingCount: string;
}
