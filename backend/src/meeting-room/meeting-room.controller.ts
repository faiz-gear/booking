import {
  Controller,
  Get,
  DefaultValuePipe,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { generateParseIntPipe } from 'src/utils';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';
import { MeetingRoomVo } from './vo/meeting-room.vo';
import { MeetingRoomListVo } from './vo/meeting-room-list.vo';

@ApiTags('会议室')
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'capacity',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'equipment',
    type: String,
    required: false,
  })
  @ApiResponse({
    type: MeetingRoomListVo,
  })
  @Get('list')
  @RequireLogin()
  list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment') equipment: string,
  ) {
    return this.meetingRoomService.find(
      pageNo,
      pageSize,
      name,
      capacity,
      equipment,
    );
  }

  @ApiBearerAuth()
  @ApiBody({
    type: CreateMeetingRoomDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '会议室已存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  @RequireLogin()
  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UpdateMeetingRoomDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '会议室不存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  @RequireLogin()
  @Put('update')
  async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(meetingRoomDto);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: '会议室ID',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: MeetingRoomVo,
  })
  @RequireLogin()
  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.meetingRoomService.findById(id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: '会议室ID',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  @Delete(':id')
  @RequireLogin()
  async delete(@Param('id') id: number) {
    return await this.meetingRoomService.delete(id);
  }
}
