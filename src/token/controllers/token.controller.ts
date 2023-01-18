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
import { TokenService } from '@app/token/services/token.service';
import { Token } from '@app/token/dao/entity/token';
import { AddTokenDto } from '@app/token/dto/add-token.dto';
import { AppGuard } from '@app/application/guard/app.guard';

@Controller()
@ApiTags('Token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('token')
  @UseGuards(AppGuard)
  @ApiBearerAuth()
  public async add(@Body() dto: AddTokenDto): Promise<Token> {
    return this.tokenService.add(dto);
  }

  @Get('tokens')
  public async getAll(): Promise<Token[]> {
    return this.tokenService.getAll();
  }

  @Delete('token/:tokenId')
  @UseGuards(AppGuard)
  @ApiBearerAuth()
  public async delete(@Param('tokenId') tokenId: string): Promise<void> {
    return await this.tokenService.remove(tokenId);
  }
}
