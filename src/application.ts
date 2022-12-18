import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent, UserServiceBindings
} from '@loopback/authentication-jwt';
import {AuthorizationComponent, AuthorizationDecision, AuthorizationOptions} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DbDataSource} from './datasources';
import {PasswordHasherBindings, TokenServiceBindings} from './keys';
import {UserRepository} from './repositories';
import {MySequence} from './sequence';
import {BcryptHasher} from './services/hash.password';
import {JWTService} from './services/jwt-service';
import {MyUserService} from './services/user-service';
// import {MyAuthorizationProvider} from './provider/MyAuthorizationProvider'

export {ApplicationConfig};
const options: AuthorizationOptions = {
  precedence: AuthorizationDecision.DENY,
  defaultDecision: AuthorizationDecision.DENY,
};

export class Loopback4UdtApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;


    this.sequence(MySequence);


    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.component(AuthorizationComponent);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10)
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository);

    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
