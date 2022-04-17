import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemporaryWalletAddCoinAndNetworkColumns1650193407491
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."temporary_wallets_network_enum" AS ENUM('BTC', 'ETH', 'TRON')`,
    );
    await queryRunner.query(
      `ALTER TABLE "temporary_wallets" ADD "network" "public"."temporary_wallets_network_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."temporary_wallets_coin_enum" AS ENUM('BTC', 'ETH', 'TRON')`,
    );
    await queryRunner.query(
      `ALTER TABLE "temporary_wallets" ADD "coin" "public"."temporary_wallets_coin_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "temporary_wallets" DROP COLUMN "coin"`,
    );
    await queryRunner.query(`DROP TYPE "public"."temporary_wallets_coin_enum"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_wallets" DROP COLUMN "network"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."temporary_wallets_network_enum"`,
    );
  }
}
