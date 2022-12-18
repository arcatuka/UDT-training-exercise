import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserWithPassword, UserWithPasswordRelations} from '../models';

export class UserWithPasswordRepository extends DefaultCrudRepository<
  UserWithPassword,
  typeof UserWithPassword.prototype.id,
  UserWithPasswordRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserWithPassword, dataSource);
  }
}
