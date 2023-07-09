import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateNhapKhoThuoc1687590879882 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE nhapKhoThuoc
            ADD COLUMN trangThai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER tongTien
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
