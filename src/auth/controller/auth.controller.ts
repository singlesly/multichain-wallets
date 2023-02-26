import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthResponse } from '@app/auth/controller/auth.response';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Web3AuthDto } from '@app/auth/dto/web3-auth.dto';
import { Web3AuthService } from '@app/auth/services/web3-auth.service';
import { AccountResponse } from '@app/auth/controller/account.response';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { AuthGuard } from '@app/auth/guards/auth.guard';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly web3AuthService: Web3AuthService,
    private readonly authUserRepository: AuthUserPgRepository,
  ) {}

  @Get('accounts')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async getAccounts(): Promise<AccountResponse[]> {
    const users = await this.authUserRepository.getAll();

    return users.map((user) => ({
      address: user.address,
      id: user.id,
      createdAt: user.createdAt,
    }));
  }

  @Post('web3')
  @ApiOkResponse({
    type: AuthResponse,
  })
  public async web3Auth(@Body() dto: Web3AuthDto): Promise<AuthResponse> {
    return new AuthResponse(await this.web3AuthService.web3Auth(dto.signature));
  }
}
