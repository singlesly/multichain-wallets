import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @IsDefined()
  @ApiProperty()
  @IsString()
  readonly name: string;
}
