import { Controller, Post } from '@nestjs/common';
import { AuthService } from '@app/auth/services/auth.service';
import { Web3AuthService } from '@app/auth/services/web3-auth.service';
import { AuthResponse } from '@app/auth/controller/auth.response';
import { AuthDto } from '@app/auth/dto/auth.dto';
import { Web3AuthDto } from '@app/auth/dto/web3-auth.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly web3AuthService: Web3AuthService,
  ) {}

  @Post('login')
  public async auth(dto: AuthDto): Promise<AuthResponse> {
    return new AuthResponse(
      await this.authService.auth(dto.login, dto.password),
    );
  }

  @Post('web3')
  public async web3Auth(dto: Web3AuthDto): Promise<AuthResponse> {
    return new AuthResponse(await this.web3AuthService.web3Auth(dto.signature));
  }
}
