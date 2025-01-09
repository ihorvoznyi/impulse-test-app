import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'node:path';
import { SnakeCaseStrategy } from './strategies';

import { Environment } from 'src/configs';

// const isDevelopment = Environment.NODE_ENV !== 'production';
// const filesExtension = isDevelopment ? '.ts' : '.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Environment.DB_HOST,
  port: Environment.DB_PORT,

  username: Environment.DB_USERNAME,
  password: Environment.DB_PASSWORD,
  database: Environment.DB_NAME,

  dropSchema: false,

  entities: [join(__dirname, 'entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  subscribers: [join(__dirname, 'subscribers/*.subscriber{.ts,.js}')],

  namingStrategy: new SnakeCaseStrategy(),

  extra: {
    max: Environment.DB_MAX_CONNECTIONS,
    ssl: undefined,
  },

  logging: false,
  synchronize: false,
  // logging: Environment.NODE_ENV !== 'production',
});
