import { ApiProperty } from '@nestjs/swagger';

export class HealthServiceResponse {
  @ApiProperty()
  public readonly serviceName: string;

  @ApiProperty()
  public readonly available: boolean;

  constructor(serviceName: string, available: boolean) {
    this.serviceName = serviceName;
    this.available = available;
  }
}
