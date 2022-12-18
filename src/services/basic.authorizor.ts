// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata
} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
  authorizationCtx:AuthorizationContext,
  metadata:AuthorizationMetadata) : Promise<AuthorizationDecision> {
    let currentuser: UserProfile
    if(authorizationCtx.principals.length > 0)
    {
      console.log(authorizationCtx.principals)
      console.log(metadata.allowedRoles)

      const user = _.pick(authorizationCtx.principals[0],
        [
          'id',
          'name',
          'roles',
        ]);
      currentuser ={[securityId]:user.id,roles:user.roles,name:user.name};
    }
    else{
      return AuthorizationDecision.DENY;
    }

    console.log(currentuser.roles)
    if(!currentuser.roles)
    {
      return AuthorizationDecision.DENY;
    }
    if(!metadata.allowedRoles)
    {
      return AuthorizationDecision.DENY;
    }

    let roleIsAllowed = false;
    for(const role of currentuser.roles){
      if(metadata.allowedRoles!.includes(role)){
        roleIsAllowed = true
        break
      }
    }
    if(!roleIsAllowed){
      return AuthorizationDecision.DENY
    }
    if(currentuser.roles.includes('admin'))
    {
      return AuthorizationDecision.ALLOW
    }

    return AuthorizationDecision.DENY;

}
