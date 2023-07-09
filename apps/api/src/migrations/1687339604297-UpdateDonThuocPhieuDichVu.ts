import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateDonThuocPhieuDichVu1687339604297 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE donThuoc
            DROP COLUMN trangThai,
            ADD COLUMN hoaDonId BIGINT NULL AFTER loiDan,
            ADD COLUMN maDonThuoc VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci'
        `);
        await queryRunner.query(`
            ALTER TABLE phieuDichVu
            DROP COLUMN trangThai,
            ADD COLUMN hoaDonId BIGINT NULL AFTER lichKhamId,
            ADD COLUMN maPhieuDichVu VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci'
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
