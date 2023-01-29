import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationResponse {
  @ApiPropertyOptional({
    type: 'string',
    name: 'order',
  })
  @IsOptional()
  @IsString()
  public readonly orderBy?: string;

  @ApiPropertyOptional({
    type: 'string',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    name: 'orderBy',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  public readonly order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    type: 'number',
    example: 0,
    name: 'page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public readonly page: number | undefined = 0;

  @ApiPropertyOptional({
    type: 'number',
    example: 0,
    name: 'pageSize',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public readonly pageSize: number | undefined = 10;

  @ApiPropertyOptional({
    type: 'number',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  public readonly total: number | null | undefined = null;

  constructor(data: Partial<PaginationResponse> = {}) {
    this.page = data.page;
    this.pageSize = data.pageSize;
    this.total = data.total;
    this.order = data.order;
    this.orderBy = data.orderBy;
  }

  public withTotal(total: number): PaginationResponse {
    return new PaginationResponse({
      total: total,
      orderBy: this.orderBy,
      order: this.order,
      pageSize: this.pageSize,
      page: this.page,
    });
  }
}
