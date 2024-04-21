import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { BookingModule } from './booking/booking.module';
import { StatsModule } from './stats/stats.module';
import { isProduction, pathJoin } from './utils';
import { buildDataSourceOptions } from './data-source';

const envPaths = [pathJoin('.env.local'), pathJoin('.env')];
if (isProduction) {
  // 生产环境下，只加载 .env 文件
  envPaths.shift();
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: buildDataSourceOptions,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPaths,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '30m' }, // 默认30分钟
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
