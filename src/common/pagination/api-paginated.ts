import { ApiQuery } from '@nestjs/swagger';

export function ApiPaginated(): (target, method, descriptor) => void {
  return (target, method, descriptor) => {
    ApiQuery({
      type: 'string',
      name: 'pagination[orderBy]',
      required: false,
    })(target, method, descriptor);

    ApiQuery({
      enum: ['ASC', 'DESC'],
      name: 'pagination[order]',
      required: false,
    })(target, method, descriptor);

    ApiQuery({
      type: 'number',
      example: 0,
      name: 'pagination[page]',
      required: false,
    })(target, method, descriptor);
    ApiQuery({
      type: 'number',
      example: 10,
      name: 'pagination[pageSize]',
      required: false,
    })(target, method, descriptor);
  };
}
