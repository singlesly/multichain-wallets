import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from '@app/application/dao/entity/application';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(Application)
    private readonly repository: Repository<Application>,
  ) {}

  public async getByIdOrFail(id: string): Promise<Application> {
    const found = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }
}
