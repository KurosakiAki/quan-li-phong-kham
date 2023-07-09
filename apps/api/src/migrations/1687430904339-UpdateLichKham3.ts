import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateLichKham31687430904339 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE lichKham
            ADD COLUMN email VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci' AFTER soDienThoai
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
