import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '@app/payment/repositories/payment.repository';
import { Application } from '@app/application/dao/entity/application';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
export class CheckOrderAlreadyExistsService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  public async guardExists(
    orderId: string,
    application: Application,
  ): Promise<string> {
    const compoundOrderId = `${application.id}-${orderId}`;
    const exists = this.paymentRepository.getByOrderId(compoundOrderId);
    if (exists) {
      throw new BaseException({
        message: 'Order id already exists',
        statusCode: WebErrorsEnum.DOMAIN_ERROR,
      });
    }

    return compoundOrderId;
  }
}
