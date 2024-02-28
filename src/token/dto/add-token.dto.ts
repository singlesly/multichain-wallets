import { TokenTypeEnum } from '@app/token/enums/token-type.enum';
import {
  IsDefined,
  IsEnum,
  IsLowercase,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FiatOptionsDto } from '@app/token/dto/fiat-options.dto';
import { Type } from 'class-transformer';

export class AddTokenDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly symbol!: string;

  @IsDefined()
  @IsNumber()
  @ApiProperty()
  @IsPositive()
  @Type(() => Number)
  public readonly decimals!: number;

  @IsDefined()
  @IsString()
  @IsLowercase()
  @ApiProperty()
  public readonly networkCode!: string;

  @IsDefined()
  @IsEnum(TokenTypeEnum)
  @ApiProperty()
  public readonly type!: TokenTypeEnum;

  @IsOptional()
  @IsString()
  @ApiProperty()
  public readonly contractAddress?: string;

  @ApiProperty({
    type: FiatOptionsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FiatOptionsDto)
  public readonly fiatOptions?: FiatOptionsDto;
}
