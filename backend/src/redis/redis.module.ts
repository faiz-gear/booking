import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    IORedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'single',
          url: `redis://${configService.get(
            'REDIS_SERVER_HOST',
          )}:${configService.get('REDIS_SERVER_PORT')}`,
          options: {
            db: configService.get('REDIS_SERVER_DB'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
