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
import { AppGuard } from '@app/application/guard/app.guard';
import { AuthGuard } from '@app/auth/guards/auth.guard';

@Controller()
@ApiTags('Network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('network')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async add(@Body() dto: AddNetworkDto): Promise<Network> {
    return this.networkService.add(dto);
  }

  @Get('networks')
  public async list(): Promise<Network[]> {
    return this.networkService.getAll();
  }

  @Delete('network/:code')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async remove(@Param('code') code: string): Promise<void> {
    await this.networkService.remove(code);
  }
}
