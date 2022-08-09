import { Injectable } from '@nestjs/common';
import { LocalEnvService } from '@app/local-env/services/local-env.service';
import {
  Cipher,
  CipherGCMTypes,
  createCipheriv,
  createDecipheriv,
  scryptSync,
} from 'crypto';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';

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

@Injectable()
export class EncryptService {
  private static readonly CipherAlgorithm: CipherGCMTypes = 'aes-256-gcm';
  private static readonly Iv: Buffer = Buffer.from('encrypt-service', 'utf8');

  constructor(private readonly localEnvService: LocalEnvService) {}

  public async encrypt(data: string): Promise<string> {
    return this.cipher.update(data, 'utf8', 'hex');
  }

  public async decrypt(data: string): Promise<string> {
    return this.decipher.update(data, 'hex', 'utf8');
  }

  private get cipher(): Cipher {
    return createCipheriv(
      EncryptService.CipherAlgorithm,
      this.cipherKey,
      EncryptService.Iv,
    );
  }

  private get decipher(): Cipher {
    return createDecipheriv(
      EncryptService.CipherAlgorithm,
      this.cipherKey,
      EncryptService.Iv,
    );
  }

  private get cipherPassword(): Buffer {
    return Buffer.from(
      this.localEnvService.getSafety(LocalEnvPathEnum.CIPHER_PASSWORD),
      'utf8',
    );
  }

  private get cipherKey(): Buffer {
    return scryptSync(this.cipherPassword, this.cipherPassword, 32);
  }
}
