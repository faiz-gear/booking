import { ApiProperty } from '@nestjs/swagger';

export class MeetingRoomStats {
  @ApiProperty()
  meetingRoomId: string;

  @ApiProperty()
  meetingRoomName: string;

  @ApiProperty()
  usedCount: string;
}
