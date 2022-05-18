import { PaginationDto } from '@app/common/pagination/pagination.dto';

export function typeormPagination(pagination?: PaginationDto):
  | {
      take: number;
      skip: number;
      order: Record<string, string>;
    }
  | Record<string, never> {
  if (!pagination) {
    return {};
  }

  const { page = 0, pageSize = 10, orderBy, order } = pagination || {};

  const orderParams: Record<string, string> = {};
  if (order && orderBy) {
    orderParams[orderBy] = order;
  }

  return { order: orderParams, skip: pageSize * page, take: pageSize };
}
