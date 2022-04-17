// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/*/dao/entity/**.js'],
  migrations: ['dist/*/dao/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  ssl:
    process.env.POSTGRES_USE_SSL === '1'
      ? {
          rejectUnauthorized: false,
          ca: process.env.POSTGRES_SSL_CA,
        }
      : false,
};
