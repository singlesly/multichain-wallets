import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeVirtualTransferFeature1709157552390
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('virtual_balances', true);
    await queryRunner.dropTable('virtual_transactions', true);
  }

  public async down(): Promise<void> {}
}
