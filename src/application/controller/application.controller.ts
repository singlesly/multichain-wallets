import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApplicationService } from '@app/application/service/application.service';
import { CreateApplicationDto } from '@app/application/dto/create-application.dto';
import { ApplicationResponse } from '@app/application/interfaces/application.response';
import { AppGuard } from '@app/application/guard/app.guard';
import { Application } from '@app/application/dao/entity/application';
import { AuthGuard } from '@app/auth/guards/auth.guard';

@Controller()
@ApiTags('Application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('application')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async create(
    @Body() dto: CreateApplicationDto,
  ): Promise<ApplicationResponse> {
    const app = await this.applicationService.create({
      name: dto.name,
    });

    return {
      name: app.name,
      id: app.id,
      authId: app.authId(),
      secretKey: app.secret,
    };
  }

  @Get('applications')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async list(): Promise<ApplicationResponse[]> {
    const apps = await Application.find();

    return apps.map((app) => ({
      id: app.id,
      name: app.name,
      authId: app.authId(),
      secretKey: app.secret,
    }));
  }
}
