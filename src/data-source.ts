import { DataSource } from 'typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/*/dao/entity/**.js'],
  migrations: ['dist/*/dao/migrations/*.js'],
  ssl:
    process.env.POSTGRES_USE_SSL === '1'
      ? {
          rejectUnauthorized: false,
          ca: process.env.POSTGRES_SSL_CA,
        }
      : false,
});
