import { FiatDistributionOptions } from '@app/token/interfaces/fiat-distribution.options';
import { FiatDistributionEnum } from '@app/token/enums/fiat-distribution.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class FiatOptionsDto implements FiatDistributionOptions {
  @ApiProperty({
    type: 'string',
  })
  @ValidateIf((self) => self.type !== FiatDistributionEnum.UNAVAILABLE)
  @IsString()
  public dispenserWalletAddress?: string;

  @ApiProperty({
    enum: FiatDistributionEnum,
    required: true,
  })
  @IsDefined()
  @IsEnum(FiatDistributionEnum)
  public type: FiatDistributionEnum = FiatDistributionEnum.UNAVAILABLE;
}
