export interface ContractCallableInterface {
  send<T>(
    fromPrivateKey: string,
    method: string,
    ...params: string[]
  ): Promise<T>;

  call<T>(
    fromPrivateKey: string,
    method: string,
    ...params: string[]
  ): Promise<T>;
}
