import { TokenTypeEnum } from '@app/token/enums/token-type.enum';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsLowercase,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AbiItem } from 'web3-utils';

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

  @IsOptional()
  @IsArray()
  @ApiProperty({
    default: [],
  })
  public readonly abi?: AbiItem[] = [];
}
