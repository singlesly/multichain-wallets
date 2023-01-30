import { Injectable } from '@nestjs/common';
import { Application } from '@app/application/dao/entity/application';
import { createHash, randomBytes } from 'crypto';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';

export interface CreateApplicationOptions {
  name: string;
  userId: string;
}

@Injectable()
export class ApplicationService {
  constructor(private readonly userRepository: AuthUserPgRepository) {}
  public async create(options: CreateApplicationOptions): Promise<Application> {
    const user = await this.userRepository.getById(options.userId);
    const salt = randomBytes(64).toString('hex');
    const nameSha = createHash('sha256').update(options.name).digest('hex');
    const secret = createHash('sha256')
      .update(salt + nameSha)
      .digest('hex');

    return new Application(options.name, secret, user).save();
  }
}
