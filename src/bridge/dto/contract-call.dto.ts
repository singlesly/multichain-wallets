import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContractCallDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly from!: string;

  @IsDefined()
  @IsString({
    each: true,
  })
  @ApiProperty({
    type: Array,
    example: [],
  })
  public readonly params: string[] = [];
}
