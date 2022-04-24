// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
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
