import { ValueTransformer } from 'typeorm';

export class BigIntTransformer implements ValueTransformer {
  public from(value: string): BigInt {
    return BigInt(value);
  }

  public to(value: string | BigInt): string {
    return String(value);
  }
}
