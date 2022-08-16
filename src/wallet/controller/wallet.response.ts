import { Wallet } from '../dao/entity/wallet';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { ApiProperty } from '@nestjs/swagger';
import { WalletTypeEnum } from '@app/wallet/constants/wallet-type.enum';

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

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  public readonly owners: string[];

  @ApiProperty({
    enum: WalletTypeEnum,
    type: 'enum',
  })
  public readonly type: WalletTypeEnum;

  @ApiProperty()
  public readonly createdAt: Date;

  constructor(wallet: Wallet) {
    this.address = wallet.pubKey;
    this.coin = wallet.coin;
    this.network = wallet.network;
    this.owners = wallet.owners;
    this.type = wallet.type;
    this.createdAt = wallet.createdAt;
  }
}
