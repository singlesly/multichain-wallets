import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePrivateKeyToJsonb1712880118160
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "private_key"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "private_key" jsonb NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "private_key"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "private_key" character varying(4096) NOT NULL`,
    );
  }
}
