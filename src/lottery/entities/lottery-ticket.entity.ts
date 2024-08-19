import { BasicEntity } from 'src/database/basic.entity';
import { User } from 'src/user/entities/user.entity';
import { Lottery } from './lottery.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class LotteryTicket extends BasicEntity {
  @Column({
    type: 'int',

    nullable: false,
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  number: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => Lottery, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'lottery_id',
  })
  lottery: Lottery;

  @Column({
    type: 'uuid',
    name: 'lottery_id',
    nullable: false,
  })
  lotteryId: string;
}
