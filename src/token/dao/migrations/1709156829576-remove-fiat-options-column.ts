import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeFiatOptionsColumn1709156829576
  implements MigrationInterface
{
  name = 'removeFiatOptionsColumn1709156829576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP COLUMN "fiat_distribution_options"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD "fiat_distribution_options" jsonb NOT NULL DEFAULT '{"type": "UNAVAILABLE"}'`,
    );
  }
}
