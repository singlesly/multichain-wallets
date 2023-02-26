import {
  IsBoolean,
  IsDefined,
  IsNumberString,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupAmountDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly networkCode!: string;

  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly tokenSymbol!: string;

  @IsDefined()
  @IsNumberString()
  @ApiProperty({
    type: 'string',
    example: '10000',
  })
  public readonly amountScaled!: string;

  @IsDefined()
  @IsBoolean()
  @ApiProperty({
    type: 'boolean',
    example: false,
  })
  public readonly isFiat: boolean = false;
}
