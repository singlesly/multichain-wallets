import { Injectable } from '@nestjs/common';
import { AgentServiceInterface } from '@app/bridge/interfaces/agent-service.interface';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { NetworkService } from '@app/network/services/network.service';
import { TokenService } from '@app/token/services/token.service';
import { TronCompatibleFactory } from '@app/tron/services/tron-compatible.factory';
import { AgentService } from '@app/bridge/services/agent.service';
import { CreateWalletService } from '@app/wallet/services/create-wallet.service';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import { EthereumCompatibleFactory } from '@app/ethereum/services/ethereum-compatible.factory';

@Injectable()
export class AgentServiceFactory {
  constructor(
    private readonly tronCompatibleFactory: TronCompatibleFactory,
    private readonly ethereumCompatibleFactory: EthereumCompatibleFactory,
    private readonly networkService: NetworkService,
    private readonly tokenService: TokenService,
    private readonly getWalletService: GetWalletService,
    private readonly createWalletService: CreateWalletService,
    private readonly encrypt: EncryptService,
  ) {}

  public async for(
    networkCode: string,
    tokenSymbol: string,
  ): Promise<AgentServiceInterface> {
    const network = await this.networkService.getByCode(networkCode);
    const token = await this.tokenService.getBySymbol(tokenSymbol, networkCode);
    if (network.isTronCompatible()) {
      const contract = await this.tronCompatibleFactory
        .for(network)
        .then(({ at }) => at(token));

      return new AgentService(
        network,
        token,
        contract,
        this.createWalletService,
        this.getWalletService,
        this.encrypt,
      );
    } else if (network.isEthereumCompatible()) {
      const contract = await this.ethereumCompatibleFactory
        .for(network)
        .then(({ at }) => at(token));

      return new AgentService(
        network,
        token,
        contract,
        this.createWalletService,
        this.getWalletService,
        this.encrypt,
      );
    }

    throw new BaseException({
      message: 'Network compatible is not supported',
      statusCode: WebErrorsEnum.INTERNAL_ERROR,
    });
  }
}
