import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@app/auth/services/auth.service';
import { AuthResponse } from '@app/auth/controller/auth.response';
import { AuthDto } from '@app/auth/dto/auth.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { UseFeatures } from '@ledius/feature/dist/decorators/features';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, // private readonly web3AuthService: Web3AuthService,
  ) {}

  @Post('login')
  @ApiOkResponse({
    type: AuthResponse,
  })
  @UseFeatures(LocalEnvPathEnum.FEATURE_AUTHENTICATION)
  public async auth(@Body() dto: AuthDto): Promise<AuthResponse> {
    return new AuthResponse(
      await this.authService.auth(dto.login, dto.password),
    );
  }

  // @Post('web3')
  // @ApiOkResponse({
  //   type: AuthResponse,
  // })
  // @UseFeatures(LocalEnvPathEnum.FEATURE_AUTHENTICATION)
  // public async web3Auth(@Body() dto: Web3AuthDto): Promise<AuthResponse> {
  //   return new AuthResponse(await this.web3AuthService.web3Auth(dto.signature));
  // }
}
