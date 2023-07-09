import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateHoaDonDonThuocDichVu1686540267831 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hoaDon
            DROP FOREIGN KEY fk_hd_lich_kham_id,
            DROP lichKhamId,
            ADD COLUMN khachHangId BIGINT NULL AFTER id,
            ADD CONSTRAINT fk_hd_khach_hang_id FOREIGN KEY (khachHangId) REFERENCES khachHang (id)
        `)
        await queryRunner.query(`
            ALTER TABLE donThuoc
            ADD COLUMN trangThai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER loiDan
        `)
        await queryRunner.query(`
            ALTER TABLE phieuDichVu
            ADD COLUMN trangThai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER lichKhamId
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
