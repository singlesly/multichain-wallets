import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from '@app/payment/dao/entity/payment';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
  ) {}

  public async getPaginated(): Promise<Payment[]> {
    return this.repository.find();
  }

  public async getByApplicationId(applicationId: string): Promise<Payment[]> {
    return this.repository.find({
      where: {
        application: {
          id: applicationId,
        },
      },
      relations: ['application'],
    });
  }

  public async getByIdOrFail(id: string): Promise<Payment> {
    const found = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!found) {
      throw new NotFoundException('Payment not found');
    }

    return found;
  }

  public async save(payment: Payment): Promise<void> {
    await this.repository.save(payment);
  }
}
