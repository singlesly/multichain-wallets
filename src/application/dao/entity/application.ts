import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUser } from '@app/auth/dao/entity/auth-user';

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

  @ManyToOne(() => AuthUser, {
    eager: true,
  })
  public readonly owner?: AuthUser | undefined;

  @CreateDateColumn()
  public readonly createdAt: string;

  constructor(name?: string, secret?: string, owner?: AuthUser) {
    super();
    this.name = name;
    this.secret = secret;
    if (owner) {
      this.owner = owner;
    }
  }

  public authId(): string {
    if (!this.id) {
      return '';
    }

    return this.id.replace(/-/g, '');
  }
}
