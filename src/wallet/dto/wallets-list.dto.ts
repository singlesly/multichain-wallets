import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class WalletsListDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
    required: false,
  })
  @Transform(({ value: v }) => [].concat(v))
  readonly owners?: string[];
}
