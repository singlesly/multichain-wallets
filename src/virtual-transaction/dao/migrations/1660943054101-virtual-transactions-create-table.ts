import { MigrationInterface, QueryRunner } from 'typeorm';

export class VirtualTransactionsCreateTable1660943054101
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."virtual_transactions_network_enum" AS ENUM('BTC', 'ETH', 'TRON')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."virtual_transactions_coin_enum" AS ENUM('BTC', 'ETH', 'TRX', 'USDT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "virtual_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" text NOT NULL, "to" text NOT NULL, "amount" numeric(36) NOT NULL, "network" "public"."virtual_transactions_network_enum" NOT NULL, "coin" "public"."virtual_transactions_coin_enum" NOT NULL, "note" text NOT NULL DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4c79864647abb5c9527fe14c187" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "virtual_transactions"`);
    await queryRunner.query(
      `DROP TYPE "public"."virtual_transactions_coin_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."virtual_transactions_network_enum"`,
    );
  }
}
