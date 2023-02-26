import { Module } from '@nestjs/common';
import { AppCommand } from './cli/app.command';
import { AppListCommand } from './cli/app-list.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './dao/entity/application';
import { AppGenCommand } from './cli/app-gen.command';
import { JwtModule } from '@app/jwt/jwt.module';
import { ApplicationService } from '@app/application/service/application.service';
import { ApplicationController } from '@app/application/controller/application.controller';
import { ApplicationRepository } from '@app/application/repositories/application.repository';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), JwtModule, AuthModule],
  controllers: [ApplicationController],
  providers: [
    AppCommand,
    AppListCommand,
    AppGenCommand,
    ApplicationService,
    ApplicationRepository,
  ],
  exports: [ApplicationRepository],
})
export class ApplicationModule {}
