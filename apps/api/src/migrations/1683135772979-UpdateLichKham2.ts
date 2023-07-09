import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateLichKham21683135772979 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE lichKham
            ADD COLUMN bacSiId BIGINT NULL AFTER khachHangId,
            ADD CONSTRAINT fk_bac_si_id FOREIGN KEY (bacSiId) REFERENCES bacSi (id)
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
