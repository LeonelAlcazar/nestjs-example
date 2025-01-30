import { Query, Resolver } from '@nestjs/graphql';
import { ToDo } from '../models/todo.model';

@Resolver(() => ToDo)
export class ToDoResolver {
  @Query(() => ToDo)
  getTodo() {
    return { id: 1, name: 'todo 1', description: 'desc' };
  }
}
