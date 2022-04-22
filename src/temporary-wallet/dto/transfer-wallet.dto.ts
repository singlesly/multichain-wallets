import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TransferWalletDto {
  @ApiProperty()
  public from: string;

  @ApiProperty()
  public to: string;

  @ApiProperty()
  @Transform((v) => BigInt(v.value))
  public amount: bigint;
}
