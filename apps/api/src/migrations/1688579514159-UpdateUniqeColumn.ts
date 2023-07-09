import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateUniqeColumn1688579514159 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE thuoc
            ADD undeleted BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL
        `)

        await queryRunner.query(`
            CREATE UNIQUE INDEX thuoc_index ON 
            thuoc (tenThuoc, undeleted)
        `)

        await queryRunner.query(`
            ALTER TABLE dichVu
            ADD undeleted BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL
        `)

        await queryRunner.query(`
            CREATE UNIQUE INDEX dich_vu_index ON 
            dichVu (tenDichVu, undeleted)
        `)

        await queryRunner.query(`
            ALTER TABLE nhaCungCap
            ADD undeleted BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL
        `)

        await queryRunner.query(`
            CREATE UNIQUE INDEX nha_cung_cap_index ON 
            nhaCungCap (fullname, undeleted)
        `)

        await queryRunner.query(`
            ALTER TABLE chuyenKhoa
            ADD undeleted BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL
        `)

        await queryRunner.query(`
            CREATE UNIQUE INDEX chuyen_khoa_index ON 
            chuyenKhoa (tenChuyenKhoa, undeleted)
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
