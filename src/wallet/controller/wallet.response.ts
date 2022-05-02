import { Wallet } from '../dao/entity/wallet';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { ApiProperty } from '@nestjs/swagger';

export class WalletResponse {
  @ApiProperty()
  public readonly address: string;

  @ApiProperty({
    enum: NetworkEnum,
  })
  public readonly network: NetworkEnum;

  @ApiProperty({
    enum: CoinEnum,
  })
  public readonly coin: CoinEnum;

  @ApiProperty()
  public readonly createdAt: Date;

  constructor(wallet: Wallet) {
    this.address = wallet.pubKey;
    this.coin = wallet.coin;
    this.network = wallet.network;
    this.createdAt = wallet.createdAt;
  }
}
