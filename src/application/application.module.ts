import { Module } from '@nestjs/common';
import { AppCommand } from './cli/app.command';
import { AppListCommand } from './cli/app-list.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './dao/entity/application';
import { AppGenCommand } from './cli/app-gen.command';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [AppCommand, AppListCommand, AppGenCommand],
})
export class ApplicationModule {}
