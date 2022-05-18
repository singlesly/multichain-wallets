import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { PaginationDto } from '@app/common/pagination/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const QueryPagination = createParamDecorator(
  async (_, ctx: ExecutionContext): Promise<PaginationDto> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const pagination = plainToInstance(
      PaginationDto,
      request.query?.pagination || {},
    );
    await validate(pagination);

    return pagination;
  },
);
