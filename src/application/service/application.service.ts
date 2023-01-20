import { Injectable } from '@nestjs/common';
import { Application } from '@app/application/dao/entity/application';
import { createHash, randomBytes } from 'crypto';

export interface CreateApplicationOptions {
  name: string;
}

@Injectable()
export class ApplicationService {
  public async create(options: CreateApplicationOptions): Promise<Application> {
    const salt = randomBytes(64).toString('hex');
    const nameSha = createHash('sha256').update(options.name).digest('hex');
    const secret = createHash('sha256')
      .update(salt + nameSha)
      .digest('hex');

    return new Application(options.name, secret).save();
  }
}
