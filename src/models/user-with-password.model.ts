import {Entity, model, property} from '@loopback/repository';

@model()
export class UserWithPassword extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  userId: string;

  @property({
    type: 'string',
  })
  password: string;

  constructor(data?: Partial<UserWithPassword>) {
    super(data);
  }
}

export interface UserWithPasswordRelations {
  // describe navigational properties here
}

export type UserWithPasswordWithRelations = UserWithPassword & UserWithPasswordRelations;
