import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';
import { UserStats } from './vo/user-stats.vo';
import { MeetingRoomStats } from './vo/meeting-room-stats.vo';

@ApiTags('统计')
@Controller('stats')
export class StatsController {
  @Inject(StatsService)
  private statsService: StatsService;

  @ApiBearerAuth()
  @ApiQuery({
    name: 'startTime',
    type: Date,
    required: true,
    description: '开始时间',
  })
  @ApiQuery({
    name: 'endTime',
    type: Date,
    required: true,
    description: '结束时间',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [UserStats],
  })
  @Get('users-stats')
  @RequireLogin()
  async getUsersStats(
    @Query('startTime') startTime: Date,
    @Query('endTime') endTime: Date,
  ) {
    return this.statsService.getUsersStats(startTime, endTime);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'startTime',
    type: Date,
    required: true,
    description: '开始时间',
  })
  @ApiQuery({
    name: 'endTime',
    type: Date,
    required: true,
    description: '结束时间',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [MeetingRoomStats],
  })
  @Get('meeting-room-stats')
  @RequireLogin()
  async getMeetingRoomStats(
    @Query('startTime') startTime: Date,
    @Query('endTime') endTime: Date,
  ) {
    return this.statsService.getMeetingRoomStats(startTime, endTime);
  }
}
