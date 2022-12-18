import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ProjectUser, ProjectUserRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class ProjectUserRepository extends DefaultCrudRepository<
  ProjectUser,
  typeof ProjectUser.prototype.id,
  ProjectUserRelations
> {

  public readonly user: BelongsToAccessor<User, typeof ProjectUser.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ProjectUser, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
