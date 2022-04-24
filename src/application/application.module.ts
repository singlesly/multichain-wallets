import { Module } from '@nestjs/common';
import { AppCommand } from './cli/app.command';
import { AppListCommand } from './cli/app-list.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './dao/entity/application';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [AppCommand, AppListCommand],
})
export class ApplicationModule {}
