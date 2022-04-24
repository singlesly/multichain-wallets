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
    this.http.axiosRef.interceptors.request.use((config) => {
      this.logger.log({
        label: 'Tron Request',
        request: {
          data: config.data,
          headers: config.headers,
          baseURL: config.baseURL,
          url: config.url,
        },
      });
      return config;
    });
    this.http.axiosRef.interceptors.response.use(
      (response) => {
        this.logger.log({
          label: 'Tron Response',
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
          label: 'Tron Error',
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
