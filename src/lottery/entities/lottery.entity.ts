import { BasicEntity } from 'src/database/basic.entity';
import { Operator } from 'src/operator/entities/operator.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum LotteryStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity()
export class Lottery extends BasicEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: LotteryStatus.OPEN,
  })
  status: LotteryStatus;

  @ManyToOne(() => Operator, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'created_by_operator_id',
    referencedColumnName: 'id',
  })
  createdBy: Operator | null;

  @Column({
    type: 'uuid',
    name: 'created_by_operator_id',
    nullable: true,
  })
  createdByOperatorId: string | null;

  @ManyToOne(() => Operator, {
    onDelete: 'SET NULL',
  })
  closedBy: Operator | null;

  @Column({
    type: 'uuid',
    name: 'closed_by_operator_id',
    nullable: true,
  })
  closedByOperatorId: string | null;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  endAt: Date;
}
