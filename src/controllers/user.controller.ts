import {authenticate} from '@loopback/authentication';
import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {TokenServiceBindings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {JWTService} from '../services/jwt-service';


async function MyAuthorization(authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata): Promise<AuthorizationDecision> {
  let currentuser: UserProfile
  if (authorizationCtx.principals.length > 0) {
    console.log(authorizationCtx.principals)
    console.log(metadata.allowedRoles)
    // const foundUser = await userRepository.findOne({
    //   where: {
    //     email: credentials.email
    //   }
    // });
    const user = _.pick(authorizationCtx.principals[0],
      [
        'id',
        'email',
        'name',
        'roles'
      ]);
    currentuser = {[securityId]: user.id, name: user.name, email: user.email, roles: user.roles};
  }
  else {
    return AuthorizationDecision.DENY;
  }

  console.log(currentuser.roles)
  if (!currentuser.roles) {
    return AuthorizationDecision.DENY;
  }
  if (!metadata.allowedRoles) {
    return AuthorizationDecision.DENY;
  }

  let roleIsAllowed = false;
  for (const role of currentuser.roles) {
    if (metadata.allowedRoles!.includes(role)) {
      roleIsAllowed = true
      break
    }
  }
  if (!roleIsAllowed) {
    return AuthorizationDecision.DENY
  }
  if (currentuser.roles.includes('admin')) {
    return AuthorizationDecision.ALLOW
  }

  return AuthorizationDecision.DENY;

}


@authenticate('jwt')
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) { }

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
