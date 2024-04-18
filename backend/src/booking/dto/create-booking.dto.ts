import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsNotEmpty({ message: '会议室名称不能为空' })
  @IsNumber()
  meetingRoomId: number;

  @ApiProperty()
  @ApiProperty()
  @IsNotEmpty({ message: '开始时间不能为空' })
  startTime: Date;

  @ApiProperty()
  @IsNotEmpty({ message: '结束时间不能为空' })
  endTime: Date;

  @IsOptional()
  note: string;
}
