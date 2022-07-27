import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface ExceptionData {
  statusCode: number;
  message?: string;
}

export type Cause = Error | BaseException | string | unknown;

export class BaseException {
  private readonly data: ExceptionData;
  private readonly cause?: Cause;

  constructor(
    data: ExceptionData = { statusCode: WebErrorsEnum.INTERNAL_ERROR },
    cause?: Cause,
  ) {
    this.data = data;
    this.cause = cause;
  }

  public get toHttp(): HttpException {
    return new HttpException(this.data, HttpStatus.FORBIDDEN);
  }

  public get message(): BaseExceptionResponse {
    return new BaseExceptionResponse(this.data);
  }
}

export class BaseExceptionResponse implements ExceptionData {
  @ApiPropertyOptional()
  public readonly message?: string | null = null;

  @ApiProperty({
    enum: Object.values(WebErrorsEnum),
    type: 'number',
  })
  public readonly statusCode: number;

  constructor(data: ExceptionData) {
    this.message = data.message;
    this.statusCode = data.statusCode;
  }
}
