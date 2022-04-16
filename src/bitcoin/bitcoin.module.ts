import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { BitcoinRpcClient } from './rpc/bitcoin-rpc.client';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => {
        return {
          auth: {
            username: 'root',
            password: '1234',
          },
          baseURL: 'http://127.0.0.1:18332',
          headers: {
            'Content-Type': 'text/plain',
          },
        };
      },
    }),
  ],
  providers: [BitcoinRpcClient],
  exports: [BitcoinRpcClient],
})
export class BitcoinModule {
  constructor(private readonly http: HttpService) {
    this.http.axiosRef.interceptors.response.use(null, (err) => {
      console.log('Bitcoin Rpc Error');
      console.error(err.response.data);
      throw err;
    });
  }
}
