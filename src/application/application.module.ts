import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './dao/entity/application';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
})
export class ApplicationModule {}
