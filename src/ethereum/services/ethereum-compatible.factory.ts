import { Injectable } from '@nestjs/common';
import { Network } from '@app/network/dao/entity/network';
import { Token } from '@app/token/dao/entity/token';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import { NativeContractService } from '@app/ethereum/services/native-contract.service';
import { Erc20Interface } from '@app/ethereum/interfaces/erc20.interface';
import { NativeInterface } from '@app/ethereum/interfaces/native.interface';
import { Erc20ContractService } from '@app/ethereum/services/erc20-contract.service';
import { TokenTypeEnum } from '@app/token/enums/token-type.enum';
import { Bep20ContractService } from '@app/ethereum/services/bep20-contract.service';

@Injectable()
export class EthereumCompatibleFactory {
  async for(
    network: Network,
  ): Promise<{ at: (token: Token) => Erc20Interface | NativeInterface }> {
    if (!network.isEthereumCompatible()) {
      throw new BaseException({
        message: 'Network in not compatible with ethereum',
        statusCode: WebErrorsEnum.INVALID_ARGUMENT,
      });
    }

    const web3 = new EthereumWeb3Service(network.url);

    return {
      at: (token: Token) => {
        if (token.isNative()) {
          return new NativeContractService(web3, token);
        }

        if (token.type === TokenTypeEnum.BEP20) {
          return new Bep20ContractService(web3, token);
        }

        return new Erc20ContractService(web3, token);
      },
    };
  }
}
