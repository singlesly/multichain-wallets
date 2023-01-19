import { Injectable } from '@nestjs/common';
import { Network } from '@app/network/dao/entity/network';
import TronWeb from 'tronweb';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { Token } from '@app/token/dao/entity/token';
import { Trc20ContractService } from '@app/tron/services/trc20-contract.service';
import { NativeContractService } from '@app/tron/services/native-contract.service';
import { NativeInterface } from '@app/tron/interfaces/native.interface';
import { TRC20Interface } from '@app/tron/interfaces/trc20.interface';

@Injectable()
export class TronCompatibleFactory {
  async for(
    network: Network,
  ): Promise<{ at: (token: Token) => NativeInterface | TRC20Interface }> {
    if (!network.isTronCompatible()) {
      throw new BaseException({
        message: 'Network in not compatible with tron',
        statusCode: WebErrorsEnum.INVALID_ARGUMENT,
      });
    }

    const tronweb = new TronWeb({
      fullHost: network.url,
      solidityNode: network.url,
      headers: {
        'TRON-PRO-API-KEY': network.options.apiKey,
      },
    });

    return {
      at: (token: Token) => {
        if (token.isNative()) {
          return new NativeContractService(tronweb);
        }
        return new Trc20ContractService(tronweb, token);
      },
    };
  }
}
