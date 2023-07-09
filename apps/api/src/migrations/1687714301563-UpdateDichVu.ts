import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateDichVu1687714301563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE dichVu
            ADD COLUMN loai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER tenDichVu
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
