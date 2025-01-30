import { Field, ObjectType } from '@nestjs/graphql';
import { BasicEntity } from 'src/database/basic.entity';
import { Operator } from 'src/operator/entities/operator.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum LotteryStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@ObjectType()
@Entity()
export class Lottery extends BasicEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: LotteryStatus.OPEN,
  })
  @Field(() => String)
  status: LotteryStatus;

  @ManyToOne(() => Operator, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'created_by_operator_id',
    referencedColumnName: 'id',
  })
  @Field(() => Operator, { nullable: true })
  createdBy: Operator | null;

  @Column({
    type: 'uuid',
    name: 'created_by_operator_id',
    nullable: true,
  })
  @Field({ nullable: true })
  createdByOperatorId: string | null;

  @ManyToOne(() => Operator, {
    onDelete: 'SET NULL',
  })
  @Field(() => Operator, { nullable: true })
  closedBy: Operator | null;

  @Column({
    type: 'uuid',
    name: 'closed_by_operator_id',
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  closedByOperatorId: string | null;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  @Field()
  endAt: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  winningNumber: string | null;
}
