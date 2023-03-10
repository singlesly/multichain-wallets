import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OfferDirectionEnum } from '@app/offer/enums/offer-direction.enum';
import { Token } from '@app/token/dao/entity/token';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string;

  @ManyToOne(() => Token, {
    eager: true,
  })
  public readonly token: Token;

  @Column()
  public readonly liquidityWalletAddress: string;

  @Column()
  public readonly volumeScaled: string;

  @Column({
    type: 'varchar',
  })
  public readonly direction: OfferDirectionEnum;

  @Column()
  public readonly available: boolean = true;

  @Column()
  public readonly minScaled: string;

  @Column()
  public readonly maxScaled: string;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  constructor(
    token: Token,
    liquidityWalletAddress: string,
    volumeScaled: string,
    direction: OfferDirectionEnum,
    minScaled: string,
    maxScaled: string,
  ) {
    this.token = token;
    this.liquidityWalletAddress = liquidityWalletAddress;
    this.volumeScaled = volumeScaled;
    this.direction = direction;
    this.minScaled = minScaled;
    this.maxScaled = maxScaled;
  }
}
