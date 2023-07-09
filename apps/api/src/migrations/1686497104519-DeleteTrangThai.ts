import { MigrationInterface, QueryRunner } from "typeorm"

export class DeleteTrangThai1686497104519 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE chiTietPhieuDichVu
            DROP COLUMN trangThai
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
