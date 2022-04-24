import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

const TABLE_NAME = 'applications';

@Entity(TABLE_NAME)
export class Application extends BaseEntity {
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

  constructor(name: string, secret: string) {
    super();
    this.name = name;
    this.secret = secret;
  }

  public authId(): string {
    if (!this.id) {
      return '';
    }

    return this.id.replace(/-/g, '');
  }
}
