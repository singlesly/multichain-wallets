import { PaginationDto } from '@app/common/pagination/pagination.dto';

export interface PaginatedResult<T = unknown> {
  readonly pagination: PaginationDto;
  readonly items: T[];
}
