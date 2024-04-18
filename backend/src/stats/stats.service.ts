import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class StatsService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async getUsersStats(startTime: Date, endTime: Date) {
    const usersStats = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('count(*)', 'bookingCount')
      .addSelect('u.username', 'username')
      .addSelect('u.id', 'userId')
      .leftJoin(User, 'u', 'b.userId = u.id')
      .where('b.startTime between:startTime and :endTime', {
        startTime,
        endTime,
      })
      .groupBy('b.user')
      .getRawMany();

    return usersStats;
  }

  async getMeetingRoomStats(startTime: Date, endTime: Date) {
    const res = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('m.id', 'meetingRoomId')
      .addSelect('count(*)', 'usedCount')
      .addSelect('m.name', 'meetingRoomName')
      .leftJoin(MeetingRoom, 'm', 'b.roomId = m.id')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime,
      })
      .addGroupBy('b.roomId')
      .getRawMany();
    return res;
  }
}
