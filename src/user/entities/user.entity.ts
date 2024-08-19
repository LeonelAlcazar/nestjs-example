import { BasicEntity } from 'src/database/basic.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserAuth } from './user-auth.entity';

@Entity()
export class User extends BasicEntity {
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

  @OneToOne(() => UserAuth, (userAuth) => userAuth.user)
  auth: UserAuth;
}
