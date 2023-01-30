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
import { AuthGuard } from '@app/auth/guards/auth.guard';

@Controller()
@ApiTags('Token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('token')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async add(@Body() dto: AddTokenDto): Promise<Token> {
    return this.tokenService.add(dto);
  }

  @Get('tokens')
  public async getAll(): Promise<Token[]> {
    return this.tokenService.getAll();
  }

  @Delete('token/:tokenId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async delete(@Param('tokenId') tokenId: string): Promise<void> {
    return await this.tokenService.remove(tokenId);
  }
}
