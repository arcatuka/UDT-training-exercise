import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Todo, User
} from '../models';
import {TodoRepository, UserRepository} from '../repositories';
import {Response} from '../services/response';
import {userRole} from './auth.controller';


@authenticate('jwt')
export class UserTodoController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(TodoRepository) protected todoRepository: TodoRepository,
  ) { }

  @get('/users/{id}/todos', {
    responses: {
      '200': {
        description: 'Array of User has many Todo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Todo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Todo>,
  ): Promise<Response> {
    const user = this.userRepository.todos(id).find(filter);
    console.log(userRole)
    //return user
    if (userRole === "admin")
      return {data: user, status: true, message: ''};
    return {data: [], status: false, message: "Role is not admin"};
  }

  @post('/users/{id}/todos', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Todo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodoInUser',
            exclude: ['id'],
            optional: ['createdById']
          }),
        },
      },
    }) todo: Omit<Todo, 'id'>,
  ): Promise<Todo> {
    return this.userRepository.todos(id).create(todo);
  }

  @patch('/users/{id}/todos', {
    responses: {
      '200': {
        description: 'User.Todo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Partial<Todo>,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.userRepository.todos(id).patch(todo, where);
  }

  @del('/users/{id}/todos', {
    responses: {
      '200': {
        description: 'User.Todo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.userRepository.todos(id).delete(where);
  }
}
