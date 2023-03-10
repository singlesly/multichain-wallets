import { OfferDirectionEnum } from '@app/offer/enums/offer-direction.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsLowercase,
  IsNumberString,
  IsString,
  Validate,
} from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({
    example: 'tron',
  })
  @IsDefined()
  @IsString()
  @IsLowercase()
  networkCode!: string;

  @ApiProperty({
    example: 'usdt',
  })
  @IsDefined()
  @IsString()
  @IsLowercase()
  symbol!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  liquidityWalletAddress!: string;

  @ApiProperty({
    example: '1000000',
  })
  @IsDefined()
  @IsNumberString()
  volumeScaled!: string;

  @ApiProperty({
    enum: OfferDirectionEnum,
  })
  @IsDefined()
  @IsEnum(OfferDirectionEnum)
  direction!: OfferDirectionEnum;

  @ApiProperty({
    example: '1000000',
  })
  @IsNumberString()
  minScaled!: string;

  @ApiProperty({
    example: '1000000000',
  })
  @IsDefined()
  @IsNumberString()
  @Validate((a) => BigInt(a.minScaled) < BigInt(a.maxScaled))
  maxScaled!: string;
}
