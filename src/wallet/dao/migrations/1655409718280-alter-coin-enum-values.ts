import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCoinEnumValues1655409718280 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."temporary_wallets_coin_enum" RENAME TO "temporary_wallets_coin_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallets_coin_enum" AS ENUM('BTC', 'ETH', 'TRX', 'USDT')`,
    );
    await queryRunner.query(`DELETE FROM "wallets" WHERE "coin" = 'TRON'`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ALTER COLUMN "coin" TYPE "public"."wallets_coin_enum" USING "coin"::"text"::"public"."wallets_coin_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."temporary_wallets_coin_enum_old"`,
    );
  }

  public async down(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
