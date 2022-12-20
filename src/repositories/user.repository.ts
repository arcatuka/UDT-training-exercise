import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Todo, User, UserRelations, UserWithPassword, ProjectUser} from '../models';
import {TodoRepository} from './todo.repository';
import {UserWithPasswordRepository} from './user-with-password.repository';
import {ProjectUserRepository} from './project-user.repository';

export type Credentials = {
  email: string;
  password: string;
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly userWithPassword: HasOneRepositoryFactory<UserWithPassword, typeof User.prototype.id>;

  public readonly todos: HasManyRepositoryFactory<Todo, typeof User.prototype.id>;

  public readonly projectUsers: HasManyRepositoryFactory<ProjectUser, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserWithPasswordRepository') protected userWithPasswordRepositoryGetter: Getter<UserWithPasswordRepository>, @repository.getter('TodoRepository') protected todoRepositoryGetter: Getter<TodoRepository>, @repository.getter('ProjectUserRepository') protected projectUserRepositoryGetter: Getter<ProjectUserRepository>,
  ) {
    super(User, dataSource);
    this.projectUsers = this.createHasManyRepositoryFactoryFor('projectUsers', projectUserRepositoryGetter,);
    this.registerInclusionResolver('projectUsers', this.projectUsers.inclusionResolver);
    this.todos = this.createHasManyRepositoryFactoryFor('todos', todoRepositoryGetter,);
    this.registerInclusionResolver('todos', this.todos.inclusionResolver);
    this.userWithPassword = this.createHasOneRepositoryFactoryFor('userCredentials', userWithPasswordRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userWithPassword.inclusionResolver);
  }
  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserWithPassword | undefined> {
    return this.userWithPassword(userId)
      .get()
      .catch(err => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  }
}
