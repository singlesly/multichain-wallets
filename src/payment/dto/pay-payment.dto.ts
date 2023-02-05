import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayPaymentDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly network!: string;
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly symbol!: string;
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly txId!: string;
}
