import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('note')
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  content: string;
}
