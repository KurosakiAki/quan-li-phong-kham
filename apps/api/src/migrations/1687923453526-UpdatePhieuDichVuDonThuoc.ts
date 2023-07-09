import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdatePhieuDichVuDonThuoc1687923453526 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE donThuoc
            DROP COLUMN hoaDonId,
            ADD COLUMN maHoaDon VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER loiDan
        `);
        await queryRunner.query(`
            ALTER TABLE phieuDichVu
            DROP COLUMN hoaDonId,
            ADD COLUMN maHoaDon VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER lichKhamId
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
