import { Column, ColumnOptions } from 'typeorm';
import { BigIntTransformer } from '@app/common/typeorm/bigint.transformer';

export function BigIntColumn(options: ColumnOptions = {}): PropertyDecorator {
  return Column({
    type: 'decimal',
    precision: 36,
    transformer: new BigIntTransformer(),
    ...options,
  });
}
