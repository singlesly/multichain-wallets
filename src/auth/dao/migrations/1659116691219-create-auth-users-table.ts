import { MigrationInterface, QueryRunner } from 'typeorm';

export class СreateAuthUsersTable1659116691219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_users" ("id" uuid NOT NULL, "login" character varying, "password" character varying, "address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c88cc8077366b470dafc2917366" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth_users"`);
  }
}
