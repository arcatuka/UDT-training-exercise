import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Todo,
  User,
} from '../models';
import {TodoRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from './auth.controller'

@authenticate('jwt')
@authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
export class TodoUserController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
  ) { }

  @get('/todos/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Todo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Todo.prototype.id,
  ): Promise<User> {
    return this.todoRepository.assignedTo(id);
  }
}
