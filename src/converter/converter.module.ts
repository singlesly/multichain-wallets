import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoinListService } from '@app/converter/services/coin-gecko/coin-list.service';
import { ConverterController } from '@app/converter/controller/converter.controller';
import { CryptoCurrencyConverterService } from '@app/converter/services/coin-gecko/crypto-currency-converter.service';

@Module({
  imports: [
    HttpModule.register({
      headers: {
        accept: 'application/json',
        'Accept-Encoding': 'gzip,deflate,compress',
      },
    }),
  ],
  controllers: [ConverterController],
  providers: [CoinListService, CryptoCurrencyConverterService],
  exports: [CryptoCurrencyConverterService],
})
export class ConverterModule {}
