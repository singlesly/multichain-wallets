import base58check from 'bs58check';

export function hexToBase58Check(hex: string): string {
  return base58check.encode(hex);
}
