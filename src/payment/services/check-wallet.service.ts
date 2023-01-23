import { Injectable } from '@nestjs/common';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { NetworkService } from '@app/network/services/network.service';
import { RecipientWalletDto } from '@app/payment/dto/recipient-wallet.dto';
import { Application } from '@app/application/dao/entity/application';
import { Wallets } from '@app/payment/dao/entity/payment';
import { Wallet } from '@app/wallet/dao/entity/wallet';

@Injectable()
export class CheckWalletService {
  constructor(private readonly walletService: GetWalletService) {}

  public async check(
    recipientWallets: RecipientWalletDto[],
    application: Application,
  ): Promise<Wallets> {
    const wallets = [] as Wallets;

    for (const recipientWallet of recipientWallets) {
      const wallet = await this.walletService.getByAddress(
        recipientWallet.address,
      );
      wallet.checkOwnerOrFail(application.id);
      wallets.push({
        networkCode: wallet.networkCode,
        address: wallet.pubKey,
      });
    }

    return wallets;
  }
}
