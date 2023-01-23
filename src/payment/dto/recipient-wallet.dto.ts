import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecipientWalletDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly networkCode!: string;

  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly address!: string;
}
