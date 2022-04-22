import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '@ledius/logger';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE, RequestContext } from '@ledius/request-context';

@Injectable()
export class ErrorLoggingInterceptor {
  constructor(
    private readonly http: HttpService,
    private readonly logger: LoggerService,
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<RequestContext>,
  ) {
    this.http.axiosRef.interceptors.response.use(
      (response) => {
        this.logger.log({
          label: 'Bitcoin Rpc Response',
          response: {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
          },
        });

        return response;
      },
      (err) => {
        this.logger.log({
          label: 'Bitcoin Rpc Error',
          err: err,
          extra: {
            data: err.response?.data,
          },
        });
        throw err;
      },
    );
  }
}
