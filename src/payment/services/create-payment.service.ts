import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '@app/payment/repositories/payment.repository';
import { CreatePaymentDto } from '@app/payment/dto/create-payment.dto';
import { ApplicationRepository } from '@app/application/repositories/application.repository';
import { CheckOrderAlreadyExistsService } from '@app/payment/services/check-order-already-exists.service';
import { CheckGroupAmountService } from '@app/payment/services/check-group-amount.service';
import { CheckWalletService } from '@app/payment/services/check-wallet.service';
import { CheckAmountCompatibleWalletService } from '@app/payment/services/check-amount-compatible-wallet.service';
import { Payment } from '@app/payment/dao/entity/payment';

@Injectable()
export class CreatePaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly checkOrderAlreadyExistsService: CheckOrderAlreadyExistsService,
    private readonly checkGroupAmountService: CheckGroupAmountService,
    private readonly checkWalletService: CheckWalletService,
    private readonly checkAmountCompatibleWalletService: CheckAmountCompatibleWalletService,
  ) {}

  public async create(dto: CreatePaymentDto): Promise<Payment> {
    const application = await this.applicationRepository.getByIdOrFail(
      dto.applicationId,
    );

    const [groupAmount, wallets, compoundOrderId] = await Promise.all([
      this.checkGroupAmountService.check(dto.groupAmount),
      this.checkWalletService.check(dto.recipientWallets, application),
      this.checkOrderAlreadyExistsService.guardExists(dto.orderId, application),
    ]);
    await this.checkAmountCompatibleWalletService.guardAmountCompatibleWallet(
      wallets,
      groupAmount,
    );

    const payment = new Payment(
      application,
      groupAmount,
      wallets,
      compoundOrderId,
      dto.webhook,
    );

    await this.paymentRepository.save(payment);

    return payment;
  }
}
