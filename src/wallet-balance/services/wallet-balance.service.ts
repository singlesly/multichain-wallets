import { Injectable } from '@nestjs/common';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { Wallet } from '@app/wallet/dao/entity/wallet';
import { NetworkService } from '@app/network/services/network.service';
import { TokenService } from '@app/token/services/token.service';
import { AgentServiceFactory } from '@app/bridge/factories/agent-service.factory';

export interface WalletWithBalances {
  address: string;
  network: string;
  owners: string[];
  balances: Balance;
}

export type Balance = Record<string, { amount: bigint; decimals: number }>;

@Injectable()
export class WalletBalanceService {
  constructor(
    private readonly getWalletService: GetWalletService,
    private readonly networkService: NetworkService,
    private readonly tokenService: TokenService,
    private readonly agentServiceFactory: AgentServiceFactory,
  ) {}

  public async getWalletsWithBalances(
    owners?: string[],
  ): Promise<WalletWithBalances[]> {
    const wallets = await this.getWalletService.getWallets({ owners });
    return Promise.all(
      wallets.map((wallet) => this.getBalancesForWallet(wallet)),
    );
  }

  public async getBalancesForWallet(
    wallet: Wallet,
  ): Promise<WalletWithBalances> {
    const network = await this.networkService.getByCode(wallet.networkCode);
    const tokens = await this.tokenService.getByNetwork(network.code);
    const balances: Balance = {};
    for (const token of tokens) {
      const agent = await this.agentServiceFactory.for(
        network.code,
        token.symbol,
      );
      balances[token.symbol] = await agent.getBalance(wallet.pubKey);
    }

    return {
      address: wallet.pubKey,
      network: network.code,
      owners: wallet.owners,
      balances,
    };
  }
}
