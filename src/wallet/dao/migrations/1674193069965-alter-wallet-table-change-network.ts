import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterWalletTableChangeNetwork1674193069965
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "network"`);
    await queryRunner.query(
      `DROP TYPE "public"."temporary_wallets_network_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "coin"`);
    await queryRunner.query(`DROP TYPE "public"."wallets_coin_enum"`);
    await queryRunner.query(`TRUNCATE "wallets"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "network_code" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "network_code"`);
    await queryRunner.query(
      `CREATE TYPE "public"."wallets_coin_enum" AS ENUM('BTC', 'ETH', 'TRX', 'USDT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "coin" "public"."wallets_coin_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."temporary_wallets_network_enum" AS ENUM('BTC', 'ETH', 'TRON')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "network" "public"."temporary_wallets_network_enum" NOT NULL`,
    );
  }
}
