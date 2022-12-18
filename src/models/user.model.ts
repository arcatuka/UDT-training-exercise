import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Todo} from './todo.model';
import {UserWithPassword} from './user-with-password.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  roles: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  gender?: string;

  @property({
    type: 'boolean',
  })
  isDeleted?: boolean;

  @property({
    type: 'boolean',
  })
  isActive?: boolean;

  @property({
    type: 'date',
    generated: true,
  })
  createdAt?: string;


  @property({
    type: 'date',
    generated: true,
  })
  updated?: string;

  @hasOne(() => UserWithPassword)
  userCredentials: UserWithPassword;

  // @hasOne(() => UserCred, {keyTo: 'user_id'})
  // userCredentials: UserCred;

  @hasMany(() => Todo, {keyTo: 'createdById'})
  todos: Todo[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
