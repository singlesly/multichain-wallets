import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameTableToWallets1651490293727 implements MigrationInterface {
  name = 'renameTableToWallets1651490293727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS temporary_wallets RENAME TO wallets`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS wallets RENAME TO temporary_wallets`,
    );
  }
}
