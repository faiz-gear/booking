import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Between,
  EntityManager,
  FindOptionsWhere,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './enum/booking-status.enum';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @InjectRepository(Booking)
  private bookingRepository: Repository<Booking>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  async initData() {
    const user1 = await this.entityManager.findOneBy(User, {
      id: 1,
    });
    const user2 = await this.entityManager.findOneBy(User, {
      id: 2,
    });

    const room1 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 3,
    });
    const room2 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 6,
    });

    const booking1 = new Booking();
    booking1.room = room1;
    booking1.user = user1;
    booking1.startTime = new Date();
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking1);

    const booking2 = new Booking();
    booking2.room = room2;
    booking2.user = user2;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking2);

    const booking3 = new Booking();
    booking3.room = room1;
    booking3.user = user2;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking3);

    const booking4 = new Booking();
    booking4.room = room2;
    booking4.user = user1;
    booking4.startTime = new Date();
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking4);
  }

  async find(
    pageNo: number,
    pageSize: number,
    username: string,
    meetingRoomName: string,
    bookingTimeStart: Date,
    bookingTimeEnd: Date,
    bookingPosition: string,
    status: BookingStatus,
  ) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: FindOptionsWhere<Booking> = {};

    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }

    if (meetingRoomName) {
      condition.room = {
        name: Like(`%${meetingRoomName}%`),
      };
    }

    if (bookingPosition) {
      if (!condition.room) {
        condition.room = {};
      }
      (condition.room as FindOptionsWhere<MeetingRoom>).location = Like(
        `%${bookingPosition}%`,
      );
    }

    if (bookingTimeStart && bookingTimeEnd) {
      condition.startTime = Between(
        new Date(bookingTimeStart),
        new Date(bookingTimeEnd),
      );
    } else if (bookingTimeStart) {
      condition.startTime = MoreThanOrEqual(new Date(bookingTimeStart));
    } else if (bookingTimeEnd) {
      condition.startTime = LessThanOrEqual(new Date(bookingTimeEnd));
    }

    if (status) {
      condition.status = status;
    }

    const [bookings, totalCount] = await this.bookingRepository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition,
      relations: ['user', 'room'],
      select: {
        user: {
          id: true,
          nickName: true,
          username: true,
        },
      },
    });

    return {
      bookings,
      totalCount,
    };
  }

  async add(bookingDto: CreateBookingDto, userId: number) {
    const meetingRoom = await this.entityManager.findOneBy(MeetingRoom, {
      id: bookingDto.meetingRoomId,
    });

    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }

    const user = await this.entityManager.findOneBy(User, {
      id: userId,
    });

    const booking = new Booking();
    booking.room = meetingRoom;
    booking.user = user;
    booking.startTime = new Date(bookingDto.startTime);
    booking.endTime = new Date(bookingDto.endTime);

    const res = await this.entityManager.findOneBy(Booking, {
      room: {
        id: meetingRoom.id,
      },
      startTime: LessThanOrEqual(new Date(bookingDto.endTime)),
      endTime: MoreThanOrEqual(new Date(bookingDto.startTime)),
    });

    if (res) {
      throw new BadRequestException('该时间段已被预定');
    }

    await this.entityManager.save(Booking, booking);
  }

  async apply(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id,
      },
      {
        status: BookingStatus.APPROVED,
      },
    );
    return 'success';
  }

  async reject(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id,
      },
      {
        status: BookingStatus.REJECTED,
      },
    );
    return 'success';
  }

  async unbind(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id,
      },
      {
        status: BookingStatus.CANCELED,
      },
    );
    return 'success';
  }

  async urge(id: number) {
    const flag = await this.redisService.get('urge_' + id);

    if (flag) {
      return '半小时内只能催办一次，请耐心等待';
    }

    // 查询当前预订会议室的用户和会议室信息
    const foundBooking = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: ['user', 'room'],
    });

    let email = await this.redisService.get('admin_email');

    if (!email) {
      const admin = await this.entityManager.findOne(User, {
        select: {
          email: true,
        },
        where: {
          isAdmin: true,
        },
      });

      email = admin.email;

      this.redisService.set('admin_email', admin.email);
    }

    this.emailService.sendMail({
      to: email,
      subject: '预定申请催办提醒',
      html: `用户${foundBooking.user.username} (${
        foundBooking.user.nickName
      }) 催办了预定会议室 ${foundBooking.room.name} (预订时间: ${new Date(
        foundBooking.startTime,
      ).toLocaleString()}-${new Date(
        foundBooking.endTime,
      ).toLocaleString()}) 的审批，请尽快处理。`,
    });

    this.redisService.set('urge_' + id, 1, 60 * 30);
  }
}
