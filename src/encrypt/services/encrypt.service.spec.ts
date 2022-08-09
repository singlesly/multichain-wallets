import { Test } from '@nestjs/testing';
import { EncryptService } from './encrypt.service';
import { LocalEnvService } from '../../local-env/services/local-env.service';

describe('encrypt service', () => {
  let encryptService: EncryptService;
  let localEnvServiceMock: LocalEnvService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EncryptService,
        {
          provide: LocalEnvService,
          useValue: {
            getSafety: jest.fn(),
          },
        },
      ],
    }).compile();

    encryptService = module.get(EncryptService);
    localEnvServiceMock = module.get(LocalEnvService);
  });

  describe('encrypt & decrypt with correct usage', () => {
    const encryptPassword = 'test-password';
    beforeEach(() => {
      jest
        .spyOn(localEnvServiceMock, 'getSafety')
        .mockReturnValue(encryptPassword);
    });

    it('should be encrypt and decrypt correct', async () => {
      const subject = 'text-to-encrypt';
      const encryptedText = await encryptService.encrypt(subject);
      const decryptedText = await encryptService.decrypt(encryptedText);

      expect(encryptedText).not.toEqual(subject);
      expect(decryptedText).toEqual('text-to-encrypt');
    });
  });

  describe('encrypt & decrypt with change pass decipher usage', () => {
    it('should be encrypt and decrypt correct', async () => {
      const subject = 'text-to-encrypt';

      jest.spyOn(localEnvServiceMock, 'getSafety').mockReturnValue('pass');
      const encryptedText = await encryptService.encrypt(subject);
      jest.spyOn(localEnvServiceMock, 'getSafety').mockReturnValue('no-pass');

      const decryptedText = await encryptService.decrypt(encryptedText);

      expect(encryptedText).not.toEqual(subject);
      expect(decryptedText).not.toEqual('text-to-encrypt');
    });
  });
});
