import { ValueTransformer } from 'typeorm';

export class BigIntTransformer implements ValueTransformer {
  public from(value: string): bigint {
    return BigInt(value);
  }

  public to(value: string | bigint): string {
    return String(value);
  }
}
