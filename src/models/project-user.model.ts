import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User, UserWithRelations} from './user.model';
import {Project} from './project.model';

@model()
export class ProjectUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;
  @belongsTo(() => User)
  userId?: string;

  @belongsTo(() => Project)
  projectId: string;

  constructor(data?: Partial<ProjectUser>) {
    super(data);
  }
}

export interface ProjectUserRelations {
  // describe navigational properties here
  user?: UserWithRelations
}

export type ProjectUserWithRelations = ProjectUser & ProjectUserRelations;
