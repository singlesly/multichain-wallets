import { AgentService } from '@app/bridge/services/agent.service';
import { VirtualAgentService } from '@app/bridge/services/virtual-agent.service';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { VirtualBalanceService } from '@app/virtual-balance/services/virtual-balance.service';
import { VirtualTransactionService } from '@app/virtual-transaction/services/virtual-transaction.service';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { FeatureService } from '@ledius/feature/dist/services/feature.service';
import { LoggerService } from '@ledius/logger';

@Injectable()
export class VirtualAgentServiceFactory {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly logger: LoggerService,
    private readonly virtualBalanceService: VirtualBalanceService,
    private readonly virtualTransactionService: VirtualTransactionService,
    private readonly getWalletService: GetWalletService,
    private readonly featureService: FeatureService,
  ) {}

  public for(agent: AgentService): VirtualAgentService {
    this.logger.log({
      message: 'Virtualize agent',
      agentType: agent.constructor.name,
    });

    return new VirtualAgentService(
      agent,
      this.virtualBalanceService,
      this.virtualTransactionService,
      this.getWalletService,
      this.featureService,
    );
  }
}
