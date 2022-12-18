import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {Project} from './project.model';
import {User} from './user.model';

@model()
export class Todo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;
  @property({
    type: 'string',
  })
  linkTodoId?: string;

  @property({
    type: 'string',
  })
  createdById?: string;
  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'date',
  })
  createdAt?: string;

  @property({
    type: 'date',
  })
  updated?: string;

  @hasOne(() => Todo, {keyTo: 'linkTodoId'})
  todo: Todo;

  @belongsTo(() => Project)
  projectId: string;

  @belongsTo(() => User)
  assignedToId: string;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
