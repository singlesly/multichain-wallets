import { Module } from '@nestjs/common';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { DatabaseModule } from './database/database.module';
import { EncryptModule } from './encrypt/encrypt.module';

@Module({
  imports: [BitcoinModule, DatabaseModule, EncryptModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
