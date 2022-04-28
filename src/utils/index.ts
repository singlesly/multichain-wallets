import bs58check from 'bs58check';
import web3 from 'web3';

export function hexToBase58Check(hex: string): string {
  return bs58check.encode(Buffer.from(hex, 'hex'));
}

export function base58CheckToHex(base58check: string): string {
  return bs58check.decode(base58check).toString('hex').toUpperCase();
}

export function hexAddress(base58check: string): string {
  try {
    return base58CheckToHex(base58check);
  } catch (e) {
    return base58check;
  }
}

export function toHex(value: string | number) {
  return web3.utils.toHex(value);
}
