import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Todo, TodoRelations, Project, User} from '../models';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {

  public readonly todo: HasOneRepositoryFactory<Todo, typeof Todo.prototype.id>;

  public readonly project: BelongsToAccessor<Project, typeof Todo.prototype.id>;

  public readonly assignedTo: BelongsToAccessor<User, typeof Todo.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TodoRepository') protected todoRepositoryGetter: Getter<TodoRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Todo, dataSource);
    this.assignedTo = this.createBelongsToAccessorFor('assignedTo', userRepositoryGetter,);
    this.registerInclusionResolver('assignedTo', this.assignedTo.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
    this.todo = this.createHasOneRepositoryFactoryFor('todo', todoRepositoryGetter);
    this.registerInclusionResolver('todo', this.todo.inclusionResolver);
  }
}
