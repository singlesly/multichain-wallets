import { Injectable } from '@nestjs/common';
import { VirtualTransaction } from '@app/virtual-transaction/dao/entity/virtual-transaction';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
export class VirtualTransactionPgRepository {
  constructor(
    @InjectRepository(VirtualTransaction)
    private readonly repository: Repository<VirtualTransaction>,
  ) {}

  public async getById(id: string): Promise<VirtualTransaction | null> {
    return await this.repository.findOne({
      where: {
        id,
      },
    });
  }

  public async getByIdOrFail(id: string): Promise<VirtualTransaction> {
    const found = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!found) {
      throw new BaseException({
        statusCode: WebErrorsEnum.NOT_FOUND,
        message: 'Transaction not found',
      });
    }

    return found;
  }

  public async save(
    virtualTransaction: VirtualTransaction,
  ): Promise<VirtualTransaction> {
    return await this.repository.save(virtualTransaction);
  }
}
