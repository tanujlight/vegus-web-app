/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {User} from '../interfaces/common/users'
import {BehaviorSubject} from 'rxjs'
import {share} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private user: User = null

  protected userState$ = new BehaviorSubject(this.user)

  getUser(): User {
    let user = this.user

    if (!user) {
      const userData = localStorage.getItem('user')
      if (userData) user = JSON.parse(userData)
    }
    return user
  }

  setUser(paramUser: User) {
    this.user = paramUser
    localStorage.setItem('user', JSON.stringify(paramUser))

    this.changeUserState(paramUser)
  }

  onUserStateChange() {
    return this.userState$.pipe(share())
  }

  changeUserState(paramUser: User) {
    this.userState$.next(paramUser)
  }

  setSetting(themeName: string) {
    if (this.user) {
      if (this.user.settings) {
        this.user.settings.themeName = themeName
      } else {
        this.user.settings = {themeName: themeName}
      }

      this.changeUserState(this.user)
    }
  }
}
