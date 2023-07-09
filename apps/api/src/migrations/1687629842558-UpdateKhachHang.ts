import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateKhachHang1687629842558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE khachHang
            ADD COLUMN tienSuBenh VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER address
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
