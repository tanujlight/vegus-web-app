/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, OnDestroy, OnInit, HostListener} from '@angular/core'
import {takeWhile} from 'rxjs/operators'
import {NbTokenService} from '@nebular/auth'
import {NbMenuItem} from '@nebular/theme'
import {Router, NavigationEnd} from '@angular/router'
import {StudentPagesMenu} from './student-pages-menu'
import {InitUserService} from '../@theme/services/init-user.service'
import {UserStore} from 'app/@core/stores/user.store'
import {ADMIN_ROUTES} from 'app/constants/routes'
import * as moment from 'moment'

@Component({
  selector: 'ngx-student-pages',
  styleUrls: ['student-pages.component.scss'],
  template: `
    <div class="no-print" (copy)="onCopy($event)" (contextmenu)="onContextMenu($event)">
      <!-- Conditionally use the layout -->

      <ngx-one-column-layout *ngIf="showSidebar">
        <nb-menu [items]="menu"></nb-menu>
        <router-outlet></router-outlet>
      </ngx-one-column-layout>

      <ngx-full-width-layout *ngIf="!showSidebar">
        <router-outlet></router-outlet>
      </ngx-full-width-layout>
    </div>
  `
})
export class StudentPagesComponent implements OnDestroy, OnInit {
  menu: NbMenuItem[]
  alive: boolean = true

  showSidebar: boolean = true

  constructor(
    private pagesMenu: StudentPagesMenu,
    private tokenService: NbTokenService,
    protected initUserService: InitUserService,
    private router: Router,
    protected userStore: UserStore
  ) {
    this.tokenService
      .tokenChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.initMenu()
      })
  }

  ngOnInit(): void {
    this.redirectToPathBasedOnRole()
    this.initMenu()

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRouteForSidebar(event.urlAfterRedirects)
      }
    })

    // Handle direct link (initial load)
    this.checkRouteForSidebar(this.router.url) // This will get the current URL on initial load

    if (this.isSubscriptionExpired()) {
      this.router.navigateByUrl('student/subscription/plans')
    }
  }

  private isSubscriptionExpired(): boolean {
    const user = this.userStore.getUser()

    const currentDate = new Date()
    const planEndDate = new Date(user.subscription.endDate)

    return currentDate > planEndDate
  }

  // Function to check the current route and update the sidebar visibility
  private checkRouteForSidebar(url: string): void {
    const hideSidebarRoutes = ['/subscription']

    this.showSidebar = !hideSidebarRoutes.some(route => url.includes(route))
  }

  redirectToPathBasedOnRole() {
    const userRole = this.userStore.getUser().role
    if (userRole === 'admin') {
      this.router.navigateByUrl(ADMIN_ROUTES.DASHBOARD)
    }
  }

  isSubscriptionExpiringSoon(subscriptionEndDate) {
    const today = moment() // Current date
    const endDate = moment(subscriptionEndDate) // Subscription end date
    return endDate.diff(today, 'days') < 7 && endDate.isAfter(today)
  }

  getPendingDays(subscriptionEndDate) {
    const today = moment() // Current date
    const endDate = moment(subscriptionEndDate) // Subscription end date
    const pendingDays = endDate.diff(today, 'days') // Difference in days

    if (pendingDays < 0 || pendingDays === 0) {
      return 'Expired'
    } else {
      return `${pendingDays} day${pendingDays > 1 ? 's' : ''} left`
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

        const user = this.userStore.getUser()
        if (user.role === 'subscriber') {
          const isExpiringSoon = this.isSubscriptionExpiringSoon(user.subscription.endDate)
          this.menu = [
            {
              title: isExpiringSoon ? 'Expiring Soon' : 'Subscription till',
              badge: {
                text: isExpiringSoon
                  ? this.getPendingDays(user.subscription.endDate)
                  : `${moment(user.subscription.endDate).format('Do MMM YYYY')}`,
                status: isExpiringSoon ? 'danger' : 'info'
              },
              data: {roles: ['subscriber']}
            },
            ...this.menu
          ]
        }
      })
  }

  ngOnDestroy(): void {
    this.alive = false
  }

  itemAllowed(menuItem: NbMenuItem) {
    const user = this.userStore.getUser()
    const userRole = user.role

    // if (menuItem.title === 'Qbank' && user.email !== 'guptatanuj19@gmail.com') {
    //   return false
    // }

    if (menuItem.data && menuItem.data.roles && !menuItem.data.roles.includes(userRole)) {
      return false
    }
    return true
  }

  onCopy(event: ClipboardEvent): void {
    event.preventDefault()
    alert('Warning: Action is prohibited.')
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault()
    alert('Warning: Action is prohibited.')
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Disable the developer tools
    if (
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && event.key === 'I') ||
      (event.ctrlKey && event.shiftKey && event.key === 'J') ||
      (event.ctrlKey && event.shiftKey && event.key === 'C') ||
      (event.altKey && event.metaKey && event.code === 'KeyI') ||
      (event.altKey && event.metaKey && event.code === 'KeyJ') ||
      (event.altKey && event.metaKey && event.code === 'KeyC') ||
      (event.ctrlKey && event.key === 'u')
    ) {
      event.preventDefault()
      alert('Warning: Action is prohibited.')
    } else if (
      (event.ctrlKey && (event.key === 'P' || event.key === 'p')) ||
      (event.altKey && event.metaKey && event.code === 'KeyP') ||
      (event.metaKey && (event.key === 'p' || event.key === 'P'))
    ) {
      event.preventDefault()
      alert('This section is not allowed to print or export to PDF.')
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    // Disable the print screen
    if (event.key === 'PrintScreen') {
      navigator.clipboard.writeText('')
      alert('Screenshots disabled!')
    }
  }
}
