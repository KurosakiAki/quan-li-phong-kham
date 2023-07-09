import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateUniqeLichKham1687699247409 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE lichKham
            ADD undeleted BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
            ADD confirm BOOLEAN GENERATED ALWAYS AS (IF(trangThai NOT IN ('Chờ xác nhận', 'Hủy bỏ', 'Quá hạn'), 1, NULL)) VIRTUAL
        `)

        await queryRunner.query(`
            CREATE UNIQUE INDEX lichKham_index ON 
            lichKham (bacSiId, thoiGianKham, confirm, undeleted)
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
