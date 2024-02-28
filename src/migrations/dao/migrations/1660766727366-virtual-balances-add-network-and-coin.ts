import { MigrationInterface, QueryRunner } from 'typeorm';

export class VirtualBalancesAddNetworkAndCoin1660766727366
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."virtual_balances_network_enum" AS ENUM('BTC', 'ETH', 'TRON')`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_balances" ADD "network" "public"."virtual_balances_network_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."virtual_balances_coin_enum" AS ENUM('BTC', 'ETH', 'TRX', 'USDT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_balances" ADD "coin" "public"."virtual_balances_coin_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "virtual_balances" DROP COLUMN "coin"`,
    );
    await queryRunner.query(`DROP TYPE "public"."virtual_balances_coin_enum"`);
    await queryRunner.query(
      `ALTER TABLE "virtual_balances" DROP COLUMN "network"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."virtual_balances_network_enum"`,
    );
  }
}
