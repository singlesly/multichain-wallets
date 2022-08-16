import { Module } from '@nestjs/common';
import { AppCommand } from './cli/app.command';
import { AppListCommand } from './cli/app-list.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './dao/entity/application';
import { AppGenCommand } from './cli/app-gen.command';
import { TokenModule } from '@app/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), TokenModule],
  providers: [AppCommand, AppListCommand, AppGenCommand],
})
export class ApplicationModule {}
