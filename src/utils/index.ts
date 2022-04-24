import bs58check from 'bs58check';

export function hexToBase58Check(hex: string): string {
  return bs58check.encode(Buffer.from(hex, 'hex'));
}

export function base58CheckToHex(base58check: string): string {
  return bs58check.decode(base58check).toString('hex').toUpperCase();
}
