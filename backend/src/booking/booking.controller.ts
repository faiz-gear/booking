import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './enum/booking-status.enum';

@ApiTags('预定')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'meetingRoomName',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'bookingTimeStart',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'bookingTimeEnd',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'bookingPosition',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: BookingStatus,
  })
  @RequireLogin()
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1)) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Query('username') username: string,
    @Query('meetingRoomName') meetingRoomName: string,
    @Query('bookingTimeStart') bookingTimeStart: Date,
    @Query('bookingTimeEnd') bookingTimeEnd: Date,
    @Query('bookingPosition') bookingPosition: string,
    @Query('status') status: BookingStatus,
  ) {
    return this.bookingService.find(
      pageNo,
      pageSize,
      username,
      meetingRoomName,
      bookingTimeStart,
      bookingTimeEnd,
      bookingPosition,
      status,
    );
  }

  @ApiBody({
    type: CreateBookingDto,
  })
  @Post('add')
  @RequireLogin()
  async add(
    @Body() booking: CreateBookingDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.bookingService.add(booking, userId);
    return 'success';
  }

  @Get('apply/:id')
  async apply(@Param('id') id: number) {
    return this.bookingService.apply(id);
  }

  @Get('reject/:id')
  async reject(@Param('id') id: number) {
    return this.bookingService.reject(id);
  }

  @Get('unbind/:id')
  async unbind(@Param('id') id: number) {
    return this.bookingService.unbind(id);
  }

  @Get('urge/:id')
  async urge(@Param('id') id: number) {
    return this.bookingService.urge(id);
  }
}
