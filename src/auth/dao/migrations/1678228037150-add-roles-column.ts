import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRolesColumn1678228037150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_users" ADD "roles" jsonb NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth_users" DROP COLUMN "roles"`);
  }
}
