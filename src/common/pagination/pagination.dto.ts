import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({
    type: 'string',
    name: 'pagination[order]',
  })
  @IsOptional()
  @IsString()
  public readonly orderBy?: string;

  @ApiPropertyOptional({
    type: 'string',
    examples: ['ASC', 'DESC'],
    name: 'pagination[orderBy]',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  public readonly order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    type: 'number',
    example: 0,
    name: 'pagination[page]',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public readonly page: number = 0;

  @ApiPropertyOptional({
    type: 'number',
    example: 0,
    name: 'pagination[pageSize]',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public readonly pageSize: number = 10;

  @ApiPropertyOptional({
    type: 'number',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  public readonly total: number | null = null;

  constructor(data: Partial<PaginationDto> = {}) {
    this.page = data.page;
    this.pageSize = data.pageSize;
    this.total = data.total;
    this.order = data.order;
    this.orderBy = data.orderBy;
  }

  public withTotal(total: number): PaginationDto {
    return new PaginationDto({
      total: total,
      orderBy: this.orderBy,
      order: this.order,
      pageSize: this.pageSize,
      page: this.page,
    });
  }
}
