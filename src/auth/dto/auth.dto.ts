import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly login!: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly password!: string;
}
