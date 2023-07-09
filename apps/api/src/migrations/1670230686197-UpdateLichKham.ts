import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateLichKham1670230686197 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE lichKham
            ADD COLUMN chanDoan VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER lyDo,
            ADD COLUMN khachHangId BIGINT NULL AFTER chanDoan,
            ADD COLUMN trangThai VARCHAR(255) NOT NULL DEFAULT 'Chờ xác nhận' COLLATE 'utf8_general_ci' AFTER khachHangId,
            ADD CONSTRAINT fk_khach_hang_id FOREIGN KEY (khachHangId) REFERENCES khachHang (id)
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
