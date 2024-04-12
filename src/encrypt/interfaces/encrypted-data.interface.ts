import { CipherGCMTypes } from 'crypto';

export interface EncryptedDataInterface {
  algorithm: CipherGCMTypes;
  text: string;
  iv: string;
}