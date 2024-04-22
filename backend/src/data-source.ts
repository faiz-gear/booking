import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { envPaths, isProduction } from './utils';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { Booking } from './booking/entities/booking.entity';

export function buildDataSourceOptions(
  configService: ConfigService,
): DataSourceOptions {
  const host = configService.get('MYSQL_SERVER_HOST');
  const port = configService.get('MYSQL_SERVER_PORT');
  const username = configService.get('MYSQL_SERVER_USERNAME');
  const password = configService.get('MYSQL_SERVER_PASSWORD');
  const database = configService.get('MYSQL_SERVER_DATABASE');

  return {
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    synchronize: !isProduction,
    logging: isProduction ? ['error', 'migration', 'warn'] : 'all',
    entities: [User, Role, Permission, MeetingRoom, Booking],
    poolSize: 10,
    connectorPackage: 'mysql2',
    migrations: ['src/migrations/*.ts'],
  };
}

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: envPaths,
});

export const dataSource = new DataSource(
  buildDataSourceOptions(new ConfigService()),
);
