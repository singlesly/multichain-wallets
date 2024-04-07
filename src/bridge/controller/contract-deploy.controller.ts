import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DeploySmartContractService } from '@app/ethereum/services/deploy-smart-contract.service';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import { NetworkService } from '@app/network/services/network.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';

@ApiTags('Bridge Contract')
@Controller('bridge/contract')
export class ContractDeployController {
  constructor(
    private readonly deploySmartContractService: DeploySmartContractService,
    private readonly networkService: NetworkService,
    private readonly encrypt: EncryptService,
    private readonly getWalletService: GetWalletService,
  ) {}

  @Post(':network/deploy')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        from: { type: 'string' },
        args: { type: 'array', example: [], default: [] },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async deployContract(
    @Param('network') networkCode: string,
    @Body('from') from: string,
    @Body('args') args: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const network = await this.networkService.getByCode(networkCode);
    const wallet = await this.getWalletService.getByAddress(from);
    const ownerPrivateKey = await this.encrypt.decrypt(wallet.privateKey);
    const web3 = new EthereumWeb3Service(network.url);

    const contractContent = file.buffer.toString('utf-8');

    return await this.deploySmartContractService.deploy(web3, ownerPrivateKey, {
      content: contractContent,
      args: args.split(','),
    });
  }
}
