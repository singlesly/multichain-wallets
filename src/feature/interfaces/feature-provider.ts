export interface Feature {
  readonly key: string;
  readonly enabled: boolean;
  readonly description?: string;
  readonly name?: string;
}

export interface FeatureProvider {
  getFeatures(): Promise<Feature[]>;
}
