import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableApplications1650799629075
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "applications" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL, 
            "secret" character varying(2048) NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "applications"`);
  }
}
