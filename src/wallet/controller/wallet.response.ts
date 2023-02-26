import { Wallet } from '../dao/entity/wallet';
import { ApiProperty } from '@nestjs/swagger';
import { WalletTypeEnum } from '@app/wallet/constants/wallet-type.enum';

export class WalletResponse {
  @ApiProperty()
  public readonly address: string;

  @ApiProperty({})
  public readonly network: string;

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
    this.network = wallet.networkCode;
    this.owners = wallet.owners;
    this.type = wallet.type;
    this.createdAt = wallet.createdAt;
  }
}
