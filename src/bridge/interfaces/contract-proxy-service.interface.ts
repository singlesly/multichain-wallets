export interface ContractProxyServiceInterface {
  request<T = void>(
    from: string,
    type: 'call' | 'send',
    method: string,
    ...params: string[]
  ): Promise<T>;
}
