import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined } from 'class-validator';

export class TransferWalletDto {
  @ApiProperty()
  @IsDefined()
  public from!: string;

  @ApiProperty()
  @IsDefined()
  public to!: string;

  @ApiProperty({
    type: 'string',
  })
  @IsDefined()
  @Transform((v) => BigInt(v.value))
  public amount!: bigint;
}
