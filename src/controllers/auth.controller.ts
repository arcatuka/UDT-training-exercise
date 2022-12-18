import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';

import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {
  get, getJsonSchemaRef, getModelSchemaRef, post, requestBody,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {Credentials} from '../repositories/user.repository';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt-service';
import {Response} from '../services/response';
import {MyUserService} from '../services/user-service';
//import {basicAuthorization} from '../services/basic.authorizor';
import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata
} from '@loopback/authorization';

let checker = ''
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata): Promise<AuthorizationDecision> {
  let currentuser: UserProfile
  if (authorizationCtx.principals.length > 0) {
    console.log(authorizationCtx.principals)
    console.log(metadata.allowedRoles)

    const user = _.pick(authorizationCtx.principals[0],
      [
        'id',
        'name',
        'roles',
      ]);
    currentuser = {[securityId]: user.id, roles: user.roles, name: user.name};
  }
  else {
    return AuthorizationDecision.DENY;
  }

  console.log(currentuser.roles)
  if (checker === "admin") {
    return AuthorizationDecision.ALLOW
  }

  return AuthorizationDecision.DENY;

}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};


export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) { }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User)
          },
        },
      },
    },
  })
  // async signup(@requestBody() user: User) {
  //   await validateCredentials(_.pick(user, ['email', 'password']));
  //   user.password = await this.hasher.hashPassword(user.password)
  //   const saveUser = await this.userRepository.create(user)
  //   console.log(saveUser)
  //   return _.omit(saveUser, 'password')
  // }
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: User,
  ): Promise<Response> {
    try {
      const password = await hash(newUserRequest.password, await genSalt());
      const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );


      await this.userRepository.userWithPassword(savedUser.id).create({password});

      return {data: savedUser, status: true, message: ''};
    }
    catch (err) {
      return {data: [], status: false, message: err.message};
    }
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<Response> {
    try {

      // ensure the user exists, and the password is correct
      const user = await this.userService.verifyCredentials(credentials);
      //console.log(user)
      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user);
      //console.log(userProfile)
      checker = userProfile.roles
      //console.log(checker)
      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile);
      if (!user) throw new Error('Invalid user credentials');

      return {
        data: {token: token},
        status: true,
        message: 'User credential is valid',
      };
    } catch (err) {
      return {data: [], status: false, message: err.message};
    }
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: getModelSchemaRef(User)
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Response> {
    const userId = currentUserProfile[securityId];
    const user = await this.userRepository.findById(userId);
    return {data: user, status: true, message: 'User found'};
  }

}
