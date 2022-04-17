import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemporaryWalletDto {
  @ApiProperty({
    enum: NetworkEnum,
  })
  public readonly network: NetworkEnum;

  @ApiProperty({
    enum: CoinEnum,
  })
  public readonly coin: CoinEnum;
}
