import { BasicEntity } from 'src/database/basic.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Operator } from './operator.entity';

@Entity()
export class OperatorAuth extends BasicEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  password: string;

  @OneToOne(() => Operator, (operator) => operator.auth)
  @JoinColumn({
    name: 'operator_id',
  })
  operator: Operator;

  @Column({
    type: 'uuid',
    name: 'operator_id',
    nullable: false,
  })
  operatorId: string;
}
