import { BasicEntity } from 'src/database/basic.entity';
import { Operator } from 'src/operator/entities/operator.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Withdrawal extends BasicEntity {
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

  @Column({
    type: 'int',
    nullable: false,
  })
  amount: number;

  @ManyToOne(() => Operator, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'operator_id',
  })
  operator: Operator | null;

  @Column({
    type: 'uuid',
    name: 'operator_id',
    nullable: true,
  })
  operatorId: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: WithdrawalStatus.PENDING,
  })
  status: WithdrawalStatus;
}
