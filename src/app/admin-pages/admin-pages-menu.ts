/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NbMenuItem} from '@nebular/theme'
import {Observable, of} from 'rxjs'
import {Injectable} from '@angular/core'
import {ADMIN_ROUTES} from '../constants/routes'

@Injectable()
export class AdminPagesMenu {
  getMenu(): Observable<NbMenuItem[]> {
    const dashboardMenu: NbMenuItem[] = []

    const menu: NbMenuItem[] = [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        link: ADMIN_ROUTES.DASHBOARD,
        home: true,
        children: undefined,
        data: {roles: ['admin']}
      },

      {
        title: 'Users',
        icon: 'people-outline',
        link: ADMIN_ROUTES.USERS,
        data: {roles: ['admin']},
        home: false
      },

      {
        title: 'Categories',
        icon: 'briefcase-outline',
        link: ADMIN_ROUTES.CATEGORIES,
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Questions',
        icon: 'list-outline',
        link: ADMIN_ROUTES.QUESTIONS,
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Case Studies',
        icon: 'file-text-outline',
        link: ADMIN_ROUTES.CASE_STUDIES,
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Exams',
        icon: 'book-outline',
        link: ADMIN_ROUTES.EXAMS,
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Assessments',
        icon: 'award-outline',
        link: ADMIN_ROUTES.ASSESSMENTS,
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Flash Cards',
        icon: 'flash-outline',
        link: ADMIN_ROUTES.FLASH_CARDS,
        data: {roles: ['admin']},
        home: false
      },
      {
        title: 'Plans',
        icon: 'umbrella-outline',
        link: ADMIN_ROUTES.PLANS,
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
            link: ADMIN_ROUTES.STUDY_MATERIAL.NOTES_LIST,
            data: {roles: ['admin']},
            home: false
          },
          {
            title: 'Videos',
            icon: 'video-outline',
            link: ADMIN_ROUTES.STUDY_MATERIAL.VIDEOS_LIST,
            data: {roles: ['admin']},
            home: false
          }
        ]
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
