import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { envPaths } from '../utils';

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
    synchronize: false,
    logging: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    poolSize: 10,
    connectorPackage: 'mysql2',
    migrations: ['dist/migrations/*.js'],
  };
}

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: envPaths,
});

export const dataSource = new DataSource(
  buildDataSourceOptions(new ConfigService()),
);
