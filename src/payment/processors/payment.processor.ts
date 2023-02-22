import { Injectable } from '@nestjs/common';
import {
  OnGlobalQueueError,
  OnGlobalQueueFailed,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { PaymentConsumerEnum } from '@app/payment/enums/payment-consumer.enum';
import { Job } from 'bull';
import { PaymentJob } from '@app/payment/dto/payment.job';
import { PaymentRepository } from '@app/payment/repositories/payment.repository';
import { AgentServiceFactory } from '@app/bridge/factories/agent-service.factory';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
@Processor(PaymentConsumerEnum.PAYMENT_QUEUE)
export class PaymentProcessor {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly agentServiceFactory: AgentServiceFactory,
  ) {}
  @Process(PaymentConsumerEnum.PAYMENT_CHECK_CONFIRMATIONS)
  public async webhookDistribution(job: Job<PaymentJob>): Promise<void> {
    const payment = await this.paymentRepository.getByIdOrFail(
      job.data.paymentId,
    );
    if (
      payment.paidTokenSymbol === null ||
      payment.paidNetworkCode === null ||
      payment.txId === null
    ) {
      throw new BaseException({
        message: 'Invalid payment',
        statusCode: WebErrorsEnum.INVALID_ARGUMENT,
      });
    }
    const agent = await this.agentServiceFactory.for(
      payment.paidNetworkCode,
      payment.paidTokenSymbol,
    );
    const tx = await agent.getTransaction(payment.txId);
    if (!tx.isConfirmed) {
      throw new BaseException({
        message: 'Transaction is not confirmed',
        statusCode: WebErrorsEnum.DOMAIN_ERROR,
      });
    }
    payment.confirm();
    await this.paymentRepository.save(payment);
    await job.finished();
    await job.remove();
  }

  @OnGlobalQueueFailed()
  public async handle(jobId: number, e: Error) {
    console.log('e');
    console.log(e);
  }
}
