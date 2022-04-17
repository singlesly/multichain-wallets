import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';
import { LocalEnvService } from '../env/services/local-env.service';
import { LocalEnvPathEnum } from '../env/contants/local-env-path.enum';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      useFactory: (env: LocalEnvService) => ({
        type: 'postgres',
        host: env.getSafety(LocalEnvPathEnum.DB_HOST),
        port: +env.getSafety(LocalEnvPathEnum.DB_PORT),
        username: env.getSafety(LocalEnvPathEnum.DB_USER),
        password: env.getSafety(LocalEnvPathEnum.DB_PASS),
        database: env.getSafety(LocalEnvPathEnum.DB_NAME),
      }),
      inject: [LocalEnvService],
    }),
  ],
})
export class DatabaseModule {}
