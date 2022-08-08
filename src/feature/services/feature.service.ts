import { Injectable } from '@nestjs/common';
import { Features } from '@app/feature/interfaces/features';

@Injectable({})
export class FeatureService {
  constructor(private readonly features: Features) {}
}
