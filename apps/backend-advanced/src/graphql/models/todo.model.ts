import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ToDo {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
