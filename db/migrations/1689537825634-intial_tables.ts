import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntialTables1689537825634 implements MigrationInterface {
  name = 'IntialTables1689537825634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(200) NOT NULL, "username" character varying(50) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donations" ("id" SERIAL NOT NULL, "category" character varying(50) NOT NULL, "amount" numeric(10,2) NOT NULL, "contact" character varying(50) NOT NULL, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ, "deleted_at" TIMESTAMPTZ, "user_id" integer, CONSTRAINT "PK_c01355d6f6f50fc6d1b4a946abf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "donations" ADD CONSTRAINT "FK_e0a522570e35074125c86d817ea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `INSERT INTO users (username, email, role, password) VALUES ('sani', 's@s.com', 'admin', '1a354ab2924b7408.dc618976cf9816aae6f33dbe74cb50dc9f8561117be2c6993c9b476f473a63c0')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donations" DROP CONSTRAINT "FK_e0a522570e35074125c86d817ea"`,
    );
    await queryRunner.query(`DROP TABLE "donations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
