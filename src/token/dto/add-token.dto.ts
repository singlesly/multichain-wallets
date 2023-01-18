import { Column, ManyToOne } from 'typeorm';
import { Network } from '@app/network/dao/entity/network';
import { JoinColumn } from 'typeorm/browser';
import { TokenTypeEnum } from '@app/token/enums/token-type.enum';
import {
  IsDefined,
  IsEnum,
  IsLowercase,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTokenDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly symbol: string;

  @IsDefined()
  @IsNumber()
  @ApiProperty()
  @IsPositive()
  public readonly decimals: number;

  @IsDefined()
  @IsString()
  @IsLowercase()
  @ApiProperty()
  public readonly networkCode: string;

  @IsDefined()
  @IsEnum(TokenTypeEnum)
  @ApiProperty()
  public readonly type: TokenTypeEnum;

  @IsOptional()
  @IsString()
  @ApiProperty()
  public readonly contractAddress?: string;
}
