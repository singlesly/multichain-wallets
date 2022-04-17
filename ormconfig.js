// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
  name: 'default',
  type: 'postgres',
  host: 'bitcom-crypto-bridge-postgres',
  username: 'root',
  password: '1234',
  port: '5432',
  database: 'crypto_bridge',
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/*/dao/entity/**.js'],
  migrations: ['dist/*/dao/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
