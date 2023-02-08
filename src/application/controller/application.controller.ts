import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApplicationService } from '@app/application/service/application.service';
import { CreateApplicationDto } from '@app/application/dto/create-application.dto';
import { ApplicationResponse } from '@app/application/interfaces/application.response';
import { Application } from '@app/application/dao/entity/application';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { RequestPayload } from '@app/auth/decorators/request-payload';
import { RequestMeta } from '@app/auth/contants';

@Controller()
@ApiTags('Application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('application')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async create(
    @Body() dto: CreateApplicationDto,
    @RequestPayload() meta: RequestMeta,
  ): Promise<ApplicationResponse> {
    const app = await this.applicationService.create({
      name: dto.name,
      userId: meta.userId as string,
    });

    return {
      name: app.name,
      id: app.id,
      authId: app.authId(),
      secretKey: app.secret,
      owner: {
        address: app.owner?.address,
        id: app.owner?.id,
      },
    };
  }

  @Get('applications')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async list(): Promise<ApplicationResponse[]> {
    const apps = await Application.find({
      relations: ['owner'],
    });

    return apps.map((app) => ({
      id: app.id,
      name: app.name,
      authId: app.authId(),
      secretKey: app.secret,
      owner: {
        address: app.owner?.address,
        id: app.owner?.id,
      },
    }));
  }

  @Get('my-applications')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async myApplications(
    @RequestPayload() meta: RequestMeta,
  ): Promise<ApplicationResponse[]> {
    const apps = await this.applicationService.getApplicationsByOwnerId(
      meta.userId as string,
    );

    return apps.map((app) => ({
      id: app.id,
      name: app.name,
      authId: app.authId(),
      secretKey: app.secret,
      owner: {
        address: app.owner?.address,
        id: app.owner?.id,
      },
    }));
  }
}
