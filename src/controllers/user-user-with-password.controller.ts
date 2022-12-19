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
  User,
  UserWithPassword
} from '../models';
import {UserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class UserUserWithPasswordController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-with-password', {
    responses: {
      '200': {
        description: 'User has one UserWithPassword',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserWithPassword),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserWithPassword>,
  ): Promise<UserWithPassword> {
    return this.userRepository.userWithPassword(id).get(filter);
  }

  @post('/users/{id}/user-with-password', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserWithPassword)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserWithPassword, {
            title: 'NewUserWithPasswordInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userWithPassword: Omit<UserWithPassword, 'id'>,
  ): Promise<UserWithPassword> {
    return this.userRepository.userWithPassword(id).create(userWithPassword);
  }

  @patch('/users/{id}/user-with-password', {
    responses: {
      '200': {
        description: 'User.UserWithPassword PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserWithPassword, {partial: true}),
        },
      },
    })
    userWithPassword: Partial<UserWithPassword>,
    @param.query.object('where', getWhereSchemaFor(UserWithPassword)) where?: Where<UserWithPassword>,
  ): Promise<Count> {
    return this.userRepository.userWithPassword(id).patch(userWithPassword, where);
  }

  @del('/users/{id}/user-with-password', {
    responses: {
      '200': {
        description: 'User.UserWithPassword DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserWithPassword)) where?: Where<UserWithPassword>,
  ): Promise<Count> {
    return this.userRepository.userWithPassword(id).delete(where);
  }
}
