import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '@ledius/logger';

@Injectable()
export class HttpClientLoggingInterceptor {
  constructor(
    private readonly http: HttpService,
    private readonly logger: LoggerService,
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
          label: 'Tron Response Error',
          response: {
            status: err.response?.status,
            statusText: err.response?.statusText,
            headers: err.response?.headers,
            data: err.response?.data,
          },
        });
        throw err;
      },
    );
  }
}
