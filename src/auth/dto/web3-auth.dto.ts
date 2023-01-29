import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class Web3AuthDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly signature!: string;
}
