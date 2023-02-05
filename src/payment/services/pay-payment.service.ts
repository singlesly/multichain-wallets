import { ForbiddenException, Injectable } from '@nestjs/common';
import { Payment } from '@app/payment/dao/entity/payment';
import { NetworkService } from '@app/network/services/network.service';
import { TokenService } from '@app/token/services/token.service';
import { PaymentRepository } from '@app/payment/repositories/payment.repository';
import { AgentServiceFactory } from '@app/bridge/factories/agent-service.factory';

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

    return payment;
  }
}
