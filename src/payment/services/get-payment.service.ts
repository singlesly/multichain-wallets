import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '@app/payment/repositories/payment.repository';
import { Payment } from '@app/payment/dao/entity/payment';

export interface GetPaymentsOptions {
  applicationId?: string;
}

@Injectable()
export class GetPaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  public async getPayments(options: GetPaymentsOptions): Promise<Payment[]> {
    if (options.applicationId) {
      return this.paymentRepository.getByApplicationId(options.applicationId);
    }

    return this.paymentRepository.getPaginated();
  }

  public async getPaymentById(paymentId: string): Promise<Payment> {
    return this.paymentRepository.getByIdOrFail(paymentId);
  }
}
