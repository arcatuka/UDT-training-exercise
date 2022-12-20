import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {Project, ProjectWithRelations} from './project.model';
import {User, UserWithRelations} from './user.model';

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


  @belongsTo(() => User)
  assignedToId: string;

  @belongsTo(() => Project)
  projectId: string;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
  todo?: TodoWithRelations
  project?: ProjectWithRelations
  user?: UserWithRelations
}

export type TodoWithRelations = Todo & TodoRelations;
