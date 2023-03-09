import { ConverterInterface } from '@app/converter/converter.interface';
import { HttpService } from '@nestjs/axios';
import { CoinListService } from '@app/converter/services/coin-gecko/coin-list.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

export interface CoinGeckoPriceResponse {
  current_price: number;
}

@Injectable()
export class CryptoCurrencyConverterService implements ConverterInterface {
  constructor(
    private readonly http: HttpService,
    private readonly coinListService: CoinListService,
  ) {}

  public async convert(
    from: { symbol: string; decimals: number; amount: bigint },
    to: { symbol: string; decimals: number },
  ): Promise<bigint> {
    const coins = await this.coinListService.getCoins();
    const [fromCoin] = [coins.find((coin) => coin.symbol === from.symbol)];
    if (!fromCoin) {
      throw new NotFoundException(
        `Coins [${from.symbol}/${to.symbol}] not found`,
      );
    }

    const params = new URLSearchParams();
    params.set('vs_currency', to.symbol);
    params.set('ids', fromCoin.id);
    params.set('order', 'market_cap_desc');
    params.set('per_page', '1');
    params.set('page', '1');
    params.set('sparkline', 'false');

    const [rate] = await lastValueFrom(
      this.http.get<CoinGeckoPriceResponse[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        { params },
      ),
    ).then((res) => res.data);

    const amount = from.amount;
    const price = BigInt(Math.round(rate.current_price));
    const pow = BigInt(10 ** Math.abs(from.decimals - to.decimals));

    return (amount * price) / pow;
  }
}
