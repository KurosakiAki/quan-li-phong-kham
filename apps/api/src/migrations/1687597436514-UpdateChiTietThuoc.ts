import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateChiTietThuoc1687597436514 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE chiTietThuoc
            ADD COLUMN trangThai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER tongNhap
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
