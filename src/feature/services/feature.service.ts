import { Injectable } from '@nestjs/common';
import { Features } from '@app/feature/interfaces/features';
import { Feature } from '@app/feature/interfaces/feature-provider';

@Injectable({})
export class FeatureService {
  constructor(private readonly features: Features) {}

  public isOn(feature: string | Feature): boolean {
    return this.features.isOn(feature);
  }

  public on(feature: string | Feature): void {
    this.features.on(feature);
  }

  public off(feature: string | Feature): void {
    this.features.off(feature);
  }

  public toggle(feature: string | Feature): void {
    this.features.toggle(feature);
  }
}
