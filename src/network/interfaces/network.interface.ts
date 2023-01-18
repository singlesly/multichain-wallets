import { NetworkKindEnum } from '@app/network/enums/network-kind.enum';

type CommonNetworkOptions = {
  readonly name: string;
  readonly code: string;

  readonly url: string;
};

export interface BitcoinNetworkInterface extends CommonNetworkOptions {
  readonly kind: NetworkKindEnum.BITCOIN;
  readonly username: string;
  readonly password: string;
}

export interface EthereumCompatibleNetworkInterface
  extends CommonNetworkOptions {
  readonly kind: NetworkKindEnum.ETHEREUM_COMPATIBLE;
}

export interface TronCompatibleNetworkInterface extends CommonNetworkOptions {
  readonly kind: NetworkKindEnum.TRON_COMPATIBLE;
  readonly apiKey: string;
}

export type NetworkInterface =
  | BitcoinNetworkInterface
  | TronCompatibleNetworkInterface
  | EthereumCompatibleNetworkInterface;
