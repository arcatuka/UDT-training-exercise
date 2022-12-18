import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Project, ProjectRelations, ProjectUser, Todo} from '../models';
import {ProjectUserRepository} from './project-user.repository';
import {TodoRepository} from './todo.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly todos: HasManyRepositoryFactory<Todo, typeof Project.prototype.id>;

  public readonly projectUsers: HasManyRepositoryFactory<ProjectUser, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TodoRepository') protected todoRepositoryGetter: Getter<TodoRepository>, @repository.getter('ProjectUserRepository') protected projectUserRepositoryGetter: Getter<ProjectUserRepository>,
  ) {
    super(Project, dataSource);
    this.projectUsers = this.createHasManyRepositoryFactoryFor('projectUsers', projectUserRepositoryGetter,);
    this.registerInclusionResolver('projectUsers', this.projectUsers.inclusionResolver);
    this.todos = this.createHasManyRepositoryFactoryFor('todos', todoRepositoryGetter,);
    this.registerInclusionResolver('todos', this.todos.inclusionResolver);
  }
}
