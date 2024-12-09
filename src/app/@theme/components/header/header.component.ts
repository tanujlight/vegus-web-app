/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, OnDestroy, OnInit} from '@angular/core'
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme'

import {LayoutService, RippleService} from '../../../@core/utils'
import {map, takeUntil} from 'rxjs/operators'
import {Subject, Observable} from 'rxjs'
import {UserStore} from '../../../@core/stores/user.store'
import {SettingsData} from '../../../@core/interfaces/common/settings'
import {User} from '../../../@core/interfaces/common/users'
import * as moment from 'moment'

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  public readonly materialTheme$: Observable<boolean>

  private destroy$: Subject<void> = new Subject<void>()
  userPictureOnly: boolean = false
  user: User

  themes = [
    {
      value: 'material-light',
      name: 'Material Light'
    },
    {
      value: 'material-dark',
      name: 'Material Dark'
    }
  ]

  currentTheme = 'material-light'

  userMenu = this.getMenuItems()

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userStore: UserStore,
    private settingsService: SettingsData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private rippleService: RippleService
  ) {
    this.materialTheme$ = this.themeService.onThemeChange().pipe(
      map((theme: {name: string}) => {
        const themeName: string = (theme && theme.name) || ''

        return themeName.startsWith('material')
      })
    )
  }

  getMenuItems() {
    const userLink = this.user
      ? this.user.role.toLowerCase() === 'admin'
        ? '/admin/users/current/'
        : '/student/users/current/'
      : ''

    if (this.user?.role === 'subscriber' && this.user?.subscription.expired) {
      return [{title: 'Log out', link: '/auth/logout'}]
    }

    return [
      {title: 'Profile', link: userLink, queryParams: {profile: true}},
      {title: 'Change Password', link: '/auth/reset-password'},
      {title: 'Log out', link: '/auth/logout'}
    ]
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme

    this.userStore
      .onUserStateChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        if (user) {
          this.user = user
          this.user.name = user.firstName + ' ' + user.lastName
          if (this.user.role === 'subscriber') {
            this.user.subscription.expiringSoon = false

            if (this.user.subscription.endDate) {
              const diffDays = moment(this.user.subscription.endDate).diff(moment(), 'days')
              if (diffDays > 0 && diffDays < 7) {
                this.user.subscription.expiringSoon = true
                this.user.subscription.expiringIn = this.getPendingDays(this.user.subscription.endDate)
              } else if (diffDays <= 0) {
                this.user.subscription.expired = true
              }
            }
          }
          this.userMenu = this.getMenuItems()
        }
      })

    const {xl} = this.breakpointService.getBreakpointsMap()
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe((isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl))

    this.themeService
      .onThemeChange()
      .pipe(
        map(({name}) => name),
        takeUntil(this.destroy$)
      )
      .subscribe(themeName => {
        this.currentTheme = themeName
        this.rippleService.toggle(themeName.startsWith('material'))
      })
  }

  getPendingDays(subscriptionEndDate) {
    const today = moment() // Current date
    const endDate = moment(subscriptionEndDate) // Subscription end date
    const pendingDays = endDate.diff(today, 'days') // Difference in days

    if (pendingDays < 0 || pendingDays === 0) {
      return 'Expired'
    } else {
      return `${pendingDays} day${pendingDays > 1 ? 's' : ''}`
    }
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  changeTheme(themeName: string) {
    this.userStore.setSetting(themeName)
    this.settingsService.updateCurrent(this.userStore.getUser().settings).pipe(takeUntil(this.destroy$)).subscribe()

    this.themeService.changeTheme(themeName)
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar')
    this.layoutService.changeLayoutSize()

    return false
  }

  navigateHome() {
    this.menuService.navigateHome()
    return false
  }
}
