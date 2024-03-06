import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalEnvModule } from '../local-env/local-env.module';
import { LocalEnvService } from '../local-env/services/local-env.service';
import { LocalEnvPathEnum } from '../local-env/contants/local-env-path.enum';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [LocalEnvModule],
      useFactory: (env: LocalEnvService) => ({
        type: 'postgres',
        host: env.getSafety(LocalEnvPathEnum.DB_HOST),
        port: +env.getSafety(LocalEnvPathEnum.DB_PORT),
        username: env.getSafety(LocalEnvPathEnum.DB_USER),
        password: env.getSafety(LocalEnvPathEnum.DB_PASS),
        database: env.getSafety(LocalEnvPathEnum.DB_NAME),
        migrationsRun: env.getBoolean(LocalEnvPathEnum.MIGRATIONS_RUN),
        logging: true,
        migrations: [join(process.cwd(), 'dist/*/dao/migrations/*.js')],
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [LocalEnvService],
    }),
  ],
})
export class DatabaseModule {}
