import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateHoaDon1686300555477 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hoaDon
            ADD COLUMN trangThai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci'
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
