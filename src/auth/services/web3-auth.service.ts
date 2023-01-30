import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { Injectable } from '@nestjs/common';
import { AuthResult } from '@app/auth/services/auth.service';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import web3 from 'web3';
import { JwtService } from '@nestjs/jwt';
import Web3 from 'web3';

@Injectable()
export class Web3AuthService {
  private readonly signMessage = 'Authentication';

  private readonly web3: Web3 = new Web3();

  constructor(
    private readonly authUserPgRepository: AuthUserPgRepository,
    private readonly tokenService: JwtService,
  ) {}

  public async web3Auth(signature: string): Promise<AuthResult> {
    const address = this.web3.eth.accounts
      .recover(web3.utils.toHex(this.signMessage), signature)
      .toLowerCase();

    let authUser = await this.authUserPgRepository.findByAddress(address);

    if (!authUser) {
      authUser = AuthUser.createByAddress(address);
      await this.authUserPgRepository.save(authUser);
    }

    const token = await this.tokenService.signAsync({
      ownerId: authUser.id,
      userId: authUser.id,
    });

    return { token };
  }
}
