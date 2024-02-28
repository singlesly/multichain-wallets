import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFiatOptionsColumn1678363215515 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD "fiat_distribution_options" jsonb NOT NULL DEFAULT '{"type": "UNAVAILABLE"}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP COLUMN "fiat_distribution_options"`,
    );
  }
}
