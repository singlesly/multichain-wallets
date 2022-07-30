import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '@ledius/logger';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
export class HttpClientLoggingInterceptor {
  constructor(
    private readonly http: HttpService,
    private readonly logger: LoggerService,
  ) {
    this.http.axiosRef.interceptors.request.use((config) => {
      this.logger.log({
        label: 'Http Request',
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
          label: 'Http Response',
          response: {
            url: response.config.url,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
          },
        });

        return response;
      },
      async (err) => {
        this.logger.log({
          label: 'Http Response Error',
          response: {
            url: err.config?.url,
            status: err.response?.status,
            statusText: err.response?.statusText,
            headers: err.response?.headers,
            data: err.response?.data,
          },
        });
        throw new BaseException(
          {
            statusCode: WebErrorsEnum.INTERNAL_ERROR,
            message: 'Internal error',
          },
          err,
        );
      },
    );
  }
}
