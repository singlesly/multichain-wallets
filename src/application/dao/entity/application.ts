import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

const TABLE_NAME = 'applications';

@Entity(TABLE_NAME)
export class Application {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  public readonly name: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 2048,
  })
  public readonly secret: string;

  @CreateDateColumn()
  public readonly createdAt: string;
}
