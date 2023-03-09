import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CryptoCurrencyConverterService } from '@app/converter/services/coin-gecko/crypto-currency-converter.service';

@Controller()
@ApiTags('Converter')
export class ConverterController {
  constructor(
    private readonly cryptoCurrencyConverterService: CryptoCurrencyConverterService,
  ) {}

  @Get('/converter/:from/:fromDecimals/:amount/:to/:toDecimals')
  public async convert(
    @Param('from') from: string,
    @Param('fromDecimals') fromDecimals: string,
    @Param('amount') amount: string,
    @Param('to') to: string,
    @Param('toDecimals') toDecimals: string,
  ): Promise<{ amount: bigint }> {
    const resultAmount = await this.cryptoCurrencyConverterService.convert(
      {
        amount: BigInt(amount),
        decimals: Number(fromDecimals),
        symbol: from,
      },
      {
        decimals: Number(toDecimals),
        symbol: to,
      },
    );

    return { amount: resultAmount };
  }
}
