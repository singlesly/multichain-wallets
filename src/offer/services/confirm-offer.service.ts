import { Injectable } from '@nestjs/common';
import { WebhookDto } from '@app/tinkoff/dto/webhook.dto';
import { PaymentDataInterface } from '@app/offer/interfaces/payment-data.interface';
import { PaymentStatusEnum } from '@app/tinkoff/enums/payment-status.enum';
import { LoggerService } from '@ledius/logger';
import { OfferRepository } from '@app/offer/repositories/offer.repository';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { AgentServiceFactory } from '@app/bridge/factories/agent-service.factory';

@Injectable()
export class ConfirmOfferService {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly getWalletService: GetWalletService,
    private readonly agentServiceFactory: AgentServiceFactory,
    private readonly logger: LoggerService,
  ) {}
  public async confirm(dto: WebhookDto<PaymentDataInterface>): Promise<void> {
    if (dto.Status !== PaymentStatusEnum.CONFIRMED) {
      return;
    }
    if (!dto.DATA) {
      this.logger.error(`Data not found`);

      return;
    }

    const { offerId, recipientWalletAddress, amountScaled } = dto.DATA;
    const offer = await this.offerRepository.getByIdOrFail(offerId);
    const recipientWallet = await this.getWalletService.getByAddress(
      recipientWalletAddress,
    );
    const liquidityWallet = await this.getWalletService.getByAddress(
      offer.liquidityWalletAddress,
    );

    const agent = await this.agentServiceFactory.for(
      offer.token.network.code,
      offer.token.symbol,
    );
    await agent.transfer(
      liquidityWallet.pubKey,
      recipientWallet.pubKey,
      BigInt(amountScaled),
    );
  }
}
