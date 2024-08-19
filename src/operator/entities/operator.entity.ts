import { BasicEntity } from 'src/database/basic.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { OperatorAuth } from './operator-auth.entity';

@Entity()
export class Operator extends BasicEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @OneToOne(() => OperatorAuth)
  auth: OperatorAuth;
}
