/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NbMenuItem} from '@nebular/theme'
import {Observable, of} from 'rxjs'
import {Injectable} from '@angular/core'

@Injectable()
export class PagesMenu {
  getMenu(): Observable<NbMenuItem[]> {
    const dashboardMenu: NbMenuItem[] = []

    const menu: NbMenuItem[] = [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        link: '/pages/dashboard',
        home: true,
        children: undefined,
        data: {roles: ['admin', 'user']}
      },

      {
        title: 'Users',
        icon: 'people-outline',
        link: '/pages/users/list',
        data: {roles: ['admin']},
        home: false
      },

      {
        title: 'Categories',
        icon: 'briefcase-outline',
        link: '/pages/categories/list',
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Questions',
        icon: 'list-outline',
        link: '/pages/questions/list',
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Case Studies',
        icon: 'file-text-outline',
        link: '/pages/case-studies/list',
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Exams',
        icon: 'book-outline',
        link: '/pages/exams/list',
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Flash Cards',
        icon: 'flash-outline',
        link: '/pages/flash-cards/list',
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Plans',
        icon: 'flash-outline',
        link: '/pages/plans/list',
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Study Material',
        icon: 'book-open-outline',
        data: {roles: ['admin']},
        home: false,
        children: [
          {
            title: 'Notes',
            icon: 'file-text-outline',
            link: '/pages/study-material/notes/list',
            data: {roles: ['admin']},
            home: false
          },
          {
            title: 'Videos',
            icon: 'video-outline',
            link: '/pages/study-material/videos/list',
            data: {roles: ['admin']},
            home: false
          }
        ],
      }
      // {
      //   title: 'Settings',
      //   icon: 'settings-outline',
      //   link: '/pages/settings/account',
      //   home: false,
      //   children: undefined
      // }
    ]

    return of([...dashboardMenu, ...menu])
  }
}
