import { Feature } from '@app/feature/interfaces/feature-provider';

export class Features {
  private features: Record<string, Feature> = {};

  public getFeatures(): Feature[] {
    return Object.values(this.features);
  }

  public apply(feature: Feature): this {
    this.features[feature.key] = feature;

    return this;
  }

  public isOn(feature: string | Feature): boolean {
    const key = typeof feature === 'string' ? feature : feature.key;

    return Boolean(this.features[key]?.enabled);
  }

  public on(feature: string | Feature): void {
    const key = typeof feature === 'string' ? feature : feature.key;

    this.features[key] = {
      ...this.features[key],
      key,
      enabled: true,
    };
  }

  public off(feature: string | Feature): void {
    const key = typeof feature === 'string' ? feature : feature.key;

    this.features[key] = {
      ...this.features[key],
      key,
      enabled: false,
    };
  }

  public toggle(feature: string | Feature): void {
    if (this.isOn(feature)) {
      this.off(feature);
    } else {
      this.on(feature);
    }
  }
}
