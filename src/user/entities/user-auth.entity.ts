import { BasicEntity } from 'src/database/basic.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAuth extends BasicEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;
  @Column({
    type: 'longtext',
    nullable: false,
  })
  password: string;
  @OneToOne(() => User, (user) => user.auth)
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
}
