import { MigrationInterface, QueryRunner } from 'typeorm';

export class VirtualBalancesCompoundPrimaryKey1660853548200
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "virtual_balances" DROP CONSTRAINT "PK_9e8e36bee94e4b1540e9ed7d697"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_balances" ADD CONSTRAINT "PK_6c27a9a0d69ccbbe1d15f4f2801" PRIMARY KEY ("wallet_id", "network", "coin")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "virtual_balances" DROP CONSTRAINT "PK_6c27a9a0d69ccbbe1d15f4f2801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_balances" ADD CONSTRAINT "PK_9e8e36bee94e4b1540e9ed7d697" PRIMARY KEY ("wallet_id")`,
    );
  }
}
