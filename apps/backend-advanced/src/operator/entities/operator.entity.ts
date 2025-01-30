import { BasicEntity } from 'src/database/basic.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { OperatorAuth } from './operator-auth.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Operator extends BasicEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Field()
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Field()
  email: string;

  @OneToOne(() => OperatorAuth)
  auth: OperatorAuth;
}
