/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import {Injectable} from '@angular/core'
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {NbRoleProvider} from '@nebular/security'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roleProvider: NbRoleProvider) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Retrieve the required roles from the route's data
    const requiredRoles = route.data['roles'] as Array<string>

    return this.roleProvider.getRole().pipe(
      map(userRole => {
        const userRoles = userRole instanceof Array ? userRole : [userRole]

        return userRoles.some(role => requiredRoles.includes(role))
      })
    )
  }
}
