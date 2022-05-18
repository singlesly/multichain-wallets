import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemporaryWalletCreateTable1650192731582
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "temporary_wallets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "pub_key" character varying(4096) NOT NULL, 
        "private_key" character varying(4096) NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "deleted_at" TIMESTAMP, CONSTRAINT "PK_5fe09d91f97d10e4cf55da44296" PRIMARY KEY ("id"))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "temporary_wallets"`);
  }
}
