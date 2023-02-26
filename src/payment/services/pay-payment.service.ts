import { ForbiddenException, Injectable } from '@nestjs/common';
import { Payment } from '@app/payment/dao/entity/payment';
import { NetworkService } from '@app/network/services/network.service';
import { TokenService } from '@app/token/services/token.service';
import { PaymentRepository } from '@app/payment/repositories/payment.repository';
import { AgentServiceFactory } from '@app/bridge/factories/agent-service.factory';
import { InjectQueue } from '@nestjs/bull';
import { PaymentConsumerEnum } from '@app/payment/enums/payment-consumer.enum';
import { Queue } from 'bull';
import { PaymentJob } from '@app/payment/dto/payment.job';
import {
  PAYMENT_CHECK_CONFIRMATION_ATTEMPTS,
  PAYMENT_CHECK_CONFIRMATION_DELAY_IN_MILLIS,
} from '@app/payment/constants';

export interface PayOptions {
  paymentId: string;
  network: string;
  symbol: string;
  txId: string;
}

@Injectable()
export class PayPaymentService {
  constructor(
    private readonly networkService: NetworkService,
    private readonly tokenService: TokenService,
    private readonly paymentRepository: PaymentRepository,
    private readonly agentServiceFactory: AgentServiceFactory,
    @InjectQueue(PaymentConsumerEnum.PAYMENT_QUEUE)
    private readonly paymentQueue: Queue,
  ) {}

  public async pay(options: PayOptions): Promise<Payment> {
    const payment = await this.paymentRepository.getByIdOrFail(
      options.paymentId,
    );
    const network = await this.networkService.getByCode(options.network);
    const token = await this.tokenService.getBySymbol(
      options.symbol,
      network.code,
    );

    const contract = await this.agentServiceFactory.for(
      network.code,
      token.symbol,
    );
    const tx = await contract.getTransaction(options.txId);

    const requiredAmount = payment.getRequiredAmount(
      network.code,
      token.symbol,
    );

    const amountIsEnough = tx.amount >= BigInt(requiredAmount.amountScaled);

    if (!amountIsEnough) {
      throw new ForbiddenException('Amount of transaction is not enough');
    }

    const requiredRecipient = payment.getRequiredRecipient(network.code);
    const recipientIsCorrect = requiredRecipient.address === tx.to;

    if (!recipientIsCorrect) {
      throw new ForbiddenException('Transaction recipient is not correct');
    }

    payment.pay(
      network,
      token,
      {
        amountScaled: tx.amount.toString(),
        decimals: token.decimals,
      },
      tx.to,
      tx.transactionId,
      new Date(),
    );

    await this.paymentRepository.save(payment);
    await this.paymentQueue.add(
      PaymentConsumerEnum.PAYMENT_CHECK_CONFIRMATIONS,
      {
        paymentId: payment.id,
      } as PaymentJob,
      {
        attempts: PAYMENT_CHECK_CONFIRMATION_ATTEMPTS,
        backoff: {
          delay: PAYMENT_CHECK_CONFIRMATION_DELAY_IN_MILLIS,
          type: 'fixed',
        },
      },
    );

    return payment;
  }
}
