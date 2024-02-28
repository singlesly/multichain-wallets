import { ConsoleLogger, Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import path from 'path';
import { lastValueFrom } from 'rxjs';

export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
}

@Injectable()
export class CoinListService implements OnModuleInit {
  private readonly coinListFilePath = path.join(__dirname, 'coins.json');
  private readonly logger: ConsoleLogger = new ConsoleLogger(
    CoinListService.name,
  );
  constructor(private readonly http: HttpService) {}

  public async getCoins(): Promise<CoinListItem[]> {
    const json = await fs.readFile(this.coinListFilePath, 'utf-8');

    return JSON.parse(json);
  }

  async onModuleInit(): Promise<void> {
    const coinsExists = fsSync.existsSync(this.coinListFilePath);
    if (coinsExists) {
      this.logger.log(`Coins list not need update`);
      return;
    }

    this.logger.log(`Coins list need update`);
    const coinsResponse = await lastValueFrom(
      this.http.get('https://api.coingecko.com/api/v3/coins/list'),
    ).then((res) => res.data);
    this.logger.log(`Coins list updated`);

    await fs.writeFile(this.coinListFilePath, JSON.stringify(coinsResponse), {
      encoding: 'utf-8',
    });
  }
}
