import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableVirtualBalances1660761437828
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "virtual_balances" ("wallet_id" uuid NOT NULL, "balance" numeric NOT NULL DEFAULT '0', CONSTRAINT "PK_9e8e36bee94e4b1540e9ed7d697" PRIMARY KEY ("wallet_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "virtual_balances"`);
  }
}
