export class EnvProviderService {
  constructor(private readonly env: Record<string, string> = process.env) {}

  public getAll(): Record<string, string> {
    return this.env;
  }

  public get(key: string): string | undefined {
    return this.env[key];
  }

  public getSafety(key: string): string {
    const v = this.get(key);
    if (v === undefined) {
      throw new Error(`Cannot get env: ${key}`);
    }

    return v;
  }
}
