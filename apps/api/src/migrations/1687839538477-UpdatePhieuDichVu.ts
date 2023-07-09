import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdatePhieuDichVu1687839538477 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE phieuDichVu
            ADD COLUMN loai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci' AFTER id
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
