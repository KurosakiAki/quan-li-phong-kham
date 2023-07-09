import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateChiTietPhieuDichVu1687705873130 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE chiTietPhieuDichVu
            ADD soLuong INT NOT NULL DEFAULT 1
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
