import { Injectable } from '@nestjs/common';
import { LocalEnvService } from '@app/local-env/services/local-env.service';
import {
  CipherGCM,
  DecipherGCM,
  CipherGCMTypes,
  createCipheriv,
  createDecipheriv,
  scryptSync,
} from 'crypto';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { randomBytes } from 'node:crypto';

/**
 * !!! IMPORTANT
 * EN: Do not modify this service without got confirmation from business
 *     It's can be used for encrypt data into database, if cipher logic will be changed
 *     We lost functional for working with encrypted data.
 *
 *     P.S If functional broken already and you cannot decrypt data.
 *         Just try rollback database and use version of this service at 17 April 2022
 *         Or contact with author of code devsinglesly@gmail.com
 *
 * RU: Не вносите изменения в данный сервис без получения одобрения от бизнеса
 *     Сервис может быть зашифровал данные в базе данных, если логика шифрования будет изменена
 *     Мы можем потерять функционал для работы с зашифрованными данными
 *
 *     P.S Если функционал уже сломал и вы не можете дешифровать данные.
 *         Просто откатите базу данных и используйте версию данного сервиса на момент 17 апреля 2022 года
 *         Или свяжитесь с автором кода devsinglesly@gmail.com
 */

export interface EncryptedData {
  algorithm: CipherGCMTypes;
  text: string;
  iv: string;
}

export interface EncryptOptions {
  algorithm?: CipherGCMTypes;
}

@Injectable()
export class EncryptService {
  constructor(private readonly localEnvService: LocalEnvService) {}

  public async encrypt(
    data: string,
    options: EncryptOptions = {},
  ): Promise<EncryptedData> {
    const { algorithm = 'aes-256-gcm' } = options;
    const iv = randomBytes(32).toString('hex');

    const text = this.getCipher(algorithm, iv).update(data, 'utf8', 'hex');

    return { algorithm, iv, text };
  }

  public async decrypt(data: EncryptedData): Promise<string> {
    const { iv, algorithm, text } = data;

    return this.getDecipher(algorithm, iv).update(text, 'hex', 'utf8');
  }

  private getCipher(algorithm: CipherGCMTypes, iv: string): CipherGCM {
    return createCipheriv(algorithm, this.cipherKey, iv);
  }

  private getDecipher(algorithm: CipherGCMTypes, iv: string): DecipherGCM {
    return createDecipheriv(algorithm, this.cipherKey, iv);
  }

  private get cipherPassword(): string {
    return this.localEnvService.getSafety(LocalEnvPathEnum.CIPHER_PASSWORD);
  }

  private get cipherKey(): Buffer {
    return scryptSync(this.cipherPassword, this.cipherPassword, 32);
  }
}
