/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NbMenuItem} from '@nebular/theme'
import {Observable, of} from 'rxjs'
import {Injectable} from '@angular/core'

@Injectable()
export class StudentPagesMenu {
  getMenu(): Observable<NbMenuItem[]> {
    const dashboardMenu: NbMenuItem[] = []

    const menu: NbMenuItem[] = [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        link: '/student-pages/dashboard',
        home: false,
        children: undefined,
        data: {roles: ['user']}
      },
      {
        title: 'Exams',
        icon: 'book-outline',
        link: '/student-pages/exams/list',
        data: {roles: ['user']},
        home: true
      },
      {
        title: 'Reports',
        icon: 'file-text-outline',
        link: '/student-pages/reports/list',
        data: {roles: ['user']},
        home: false
      },
      {
        title: 'Flash Cards',
        icon: 'flash-outline',
        link: '/student-pages/flash-cards/list',
        data: {roles: ['user']},
        home: false
      },
      {
        title: 'Study Material',
        icon: 'book-open-outline',
        data: {roles: ['user']},
        home: false,
        children: [
          {
            title: 'Notes',
            icon: 'file-text-outline',
            link: '/student-pages/study-material/notes/list'
          },
          {
            title: 'Videos',
            icon: 'video-outline',
            link: '/student-pages/study-material/videos/list'
          }
        ]
      },
      {
        title: 'Qbank',
        icon: 'hard-drive-outline',
        data: {roles: ['user']},
        home: false,
        children: [
          {
            title: 'Create test',
            icon: 'edit-2-outline',
            link: '/student-pages/tutor/tests/new'
          },
          {
            title: 'Previous Tests',
            icon: 'list-outline',
            link: '/student-pages/tutor/tests/list'
          },
          {
            title: 'Performance',
            icon: 'award-outline',
            link: '/student-pages/tutor/performance'
          }
        ]
      }
    ]

    return of([...dashboardMenu, ...menu])
  }
}
