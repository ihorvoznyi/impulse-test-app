import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'node:path';
import { SnakeCaseStrategy } from './strategies';

import { Environment } from 'src/configs';

const isDevelopment = Environment.NODE_ENV !== 'production';
const filesExtension = isDevelopment ? '.ts' : '.js';

const cwd = process.cwd() + `/${isDevelopment ? 'src' : 'dist'}`;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Environment.DB_HOST,
  port: Environment.DB_PORT,

  username: Environment.DB_USERNAME,
  password: Environment.DB_PASSWORD,
  database: Environment.DB_NAME,

  dropSchema: false,

  entities: [join(cwd, '/**/entities/*.entity' + filesExtension)],
  migrations: [join(cwd, '/**/migrations/*' + filesExtension)],
  subscribers: [join(cwd, '/**/subscribers/*.subscriber' + filesExtension)],

  namingStrategy: new SnakeCaseStrategy(),

  extra: {
    max: Environment.DB_MAX_CONNECTIONS,
    ssl: undefined,
  },

  synchronize: false,
  logging: Environment.NODE_ENV !== 'production',
});
