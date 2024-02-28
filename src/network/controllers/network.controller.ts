import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NetworkService } from '@app/network/services/network.service';
import { Network } from '@app/network/dao/entity/network';
import { AddNetworkDto } from '@app/network/dto/add-network.dto';

@Controller()
@ApiTags('Network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('network')
  public async add(@Body() dto: AddNetworkDto): Promise<Network> {
    return this.networkService.add(dto);
  }

  @Get('networks')
  public async list(): Promise<Network[]> {
    return this.networkService.getAll();
  }

  @Delete('network/:code')
  public async remove(@Param('code') code: string): Promise<void> {
    await this.networkService.remove(code);
  }
}
