/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, OnDestroy, OnInit, HostListener} from '@angular/core'
import {takeWhile} from 'rxjs/operators'
import {NbTokenService} from '@nebular/auth'
import {NbMenuItem} from '@nebular/theme'
import {StudentPagesMenu} from './student-pages-menu'
import {InitUserService} from '../@theme/services/init-user.service'
import {UserStore} from 'app/@core/stores/user.store'
import {Router} from '@angular/router'

@Component({
  selector: 'ngx-student-pages',
  styleUrls: ['student-pages.component.scss'],
  template: `
    <div class="no-print" (copy)="onCopy($event)" (contextmenu)="onContextMenu($event)">
      <ngx-one-column-layout>
        <nb-menu [items]="menu"></nb-menu>
        <router-outlet></router-outlet>
      </ngx-one-column-layout>
    </div>
  `
})
export class StudentPagesComponent implements OnDestroy, OnInit {
  menu: NbMenuItem[]
  alive: boolean = true

  constructor(
    private pagesMenu: StudentPagesMenu,
    private tokenService: NbTokenService,
    protected initUserService: InitUserService,
    private router: Router,
    protected userStore: UserStore
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
    const userRole = this.userStore.getUser().role
    if (userRole === 'admin') {
      this.router.navigateByUrl('/pages/dashboard')
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
