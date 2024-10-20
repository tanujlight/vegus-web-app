/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, OnDestroy, OnInit} from '@angular/core'
import {takeWhile} from 'rxjs/operators'
import {ActivatedRoute, Router} from '@angular/router'
import {NbTokenService} from '@nebular/auth'
import {NbMenuItem} from '@nebular/theme'
import {PagesMenu} from './pages-menu'
import {InitUserService} from '../@theme/services/init-user.service'
import {UserStore} from 'app/@core/stores/user.store'

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `
})
export class PagesComponent implements OnDestroy, OnInit {
  menu: NbMenuItem[]
  alive: boolean = true

  constructor(
    private pagesMenu: PagesMenu,
    private tokenService: NbTokenService,
    protected initUserService: InitUserService,
    protected userStore: UserStore,
    private router: Router
  ) {
    this.redirectToPathBasedOnRole()
    this.initMenu()

    this.tokenService
      .tokenChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.initMenu()
      })
  }

  ngOnInit(): void {}

  redirectToPathBasedOnRole() {
    const userRole = this.userStore.getUser()?.role || ''
    if (userRole !== 'admin') {
      this.router.navigateByUrl('/student-pages/dashboard')
    }
  }

  initMenu() {
    this.pagesMenu
      .getMenu()
      .pipe(takeWhile(() => this.alive))
      .subscribe(menu => {
        this.menu = menu.filter(item => {
          return this.itemAllowed(item)
        })
      })
  }

  ngOnDestroy(): void {
    this.alive = false
  }

  itemAllowed(menuItem: NbMenuItem) {
    const userRole = this.userStore.getUser().role

    if (menuItem.data && menuItem.data.roles && !menuItem.data.roles.includes(userRole)) {
      return false
    }
    return true
  }
}
