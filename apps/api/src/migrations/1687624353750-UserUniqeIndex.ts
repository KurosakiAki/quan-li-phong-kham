import { MigrationInterface, QueryRunner } from "typeorm"

export class UserUniqeIndex1687624353750 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE admin
            DROP COLUMN deletedAt,
            DROP COLUMN deletedUser
        `)

        await queryRunner.query(`
            ALTER TABLE bacSi
            DROP COLUMN deletedAt,
            DROP COLUMN deletedUser
        `)

        await queryRunner.query(`
            ALTER TABLE nhanVien
            DROP COLUMN deletedAt,
            DROP COLUMN deletedUser
        `)

        await queryRunner.query(`
            ALTER TABLE khachHang
            DROP COLUMN deletedAt,
            DROP COLUMN deletedUser
        `)
        await queryRunner.query(`
            CREATE UNIQUE INDEX admin_index ON 
            admin (fullname, phone, email)
        `)

        await queryRunner.query(`
            CREATE UNIQUE INDEX bacsi_index ON 
            bacSi (fullname, phone, email)
        `)

        await queryRunner.query(`
            CREATE UNIQUE INDEX nv_index ON 
            nhanVien (fullname, phone, email)
        `)

        await queryRunner.query(`
            CREATE UNIQUE INDEX kh_index ON 
            khachHang (fullname, phone, email)
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
