import {
  Balance,
  WalletWithBalances,
} from '@app/wallet-balance/services/wallet-balance.service';
import { ApiProperty } from '@nestjs/swagger';

export class WalletWithBalancesResponse implements WalletWithBalances {
  @ApiProperty()
  address: string;

  @ApiProperty()
  balances: Balance;

  @ApiProperty()
  network: string;

  @ApiProperty()
  owners: string[];

  constructor(walletWithBalances: WalletWithBalances) {
    this.address = walletWithBalances.address;
    this.balances = walletWithBalances.balances;
    this.network = walletWithBalances.network;
    this.owners = walletWithBalances.owners;
  }
}
