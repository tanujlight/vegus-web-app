/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Observable} from 'rxjs'
import {User, UserData, UserTypeEnum} from '../../@core/interfaces/common/users'
import {Router} from '@angular/router'
import {MyToastService} from 'app/services/my-toast.service'
import {tap} from 'rxjs/operators'
import {UserStore} from '../../@core/stores/user.store'
import {Injectable} from '@angular/core'
import {NbJSThemesRegistry, NbThemeService} from '@nebular/theme'

@Injectable()
export class InitUserService {
  constructor(
    protected userStore: UserStore,
    protected usersService: UserData,
    protected jsThemes: NbJSThemesRegistry,
    protected themeService: NbThemeService,
    public myToastService: MyToastService,
    private router: Router
  ) {}

  initCurrentUser(): Observable<User> {
    return this.usersService.getCurrentUser().pipe(
      tap((user: User) => {
        if (user) {
          if (user.role === UserTypeEnum.Class && user.status === 'inactive') {
            this.router.navigate(['auth/logout'])
            return
          } else if (user.role === UserTypeEnum.Subscriber && user.status === 'inactive') {
            const checkoutUrlRegex = /subscription\/checkout\/success\?session_id=/

            if (!checkoutUrlRegex.test(this.router.url)) {
              this.router.navigateByUrl('/student/subscription/plans')
            }
          }

          this.userStore.setUser(user)

          if (user.settings && user.settings.themeName) {
            if (
              this.jsThemes.has(user.settings.themeName) &&
              !!this.jsThemes.get(user.settings.themeName).variables.initialized
            ) {
              this.themeService.changeTheme(user.settings.themeName)
            }
          }
        }
      })
    )
  }
}
