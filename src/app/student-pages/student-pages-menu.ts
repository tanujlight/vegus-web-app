/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NbMenuItem} from '@nebular/theme'
import {Observable, of} from 'rxjs'
import {Injectable} from '@angular/core'
import {STUDENT_ROUTES} from 'app/constants/routes'

@Injectable()
export class StudentPagesMenu {
  getMenu(): Observable<NbMenuItem[]> {
    const dashboardMenu: NbMenuItem[] = []

    const menu: NbMenuItem[] = [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        link: STUDENT_ROUTES.DASHBOARD,
        home: true,
        children: undefined,
        data: {roles: ['user', 'subscriber']}
      },
      {
        title: 'Exams',
        icon: 'book-outline',
        link: STUDENT_ROUTES.EXAMS.LIST,
        data: {roles: ['user']},
        home: false
      },
      {
        title: 'Reports',
        icon: 'file-text-outline',
        link: STUDENT_ROUTES.REPORTS.LIST,
        data: {roles: ['user']},
        home: false
      },
      {
        title: 'Flash Cards',
        icon: 'flash-outline',
        link: STUDENT_ROUTES.FLASH_CARDS.LIST,
        data: {roles: ['user', 'subscriber']},
        home: false
      },
      {
        title: 'Study Material',
        icon: 'book-open-outline',
        data: {roles: ['user', 'subscriber']},
        home: false,
        children: [
          {
            title: 'Notes',
            icon: 'file-text-outline',
            link: STUDENT_ROUTES.STUDY_MATERIAL.NOTES_LIST
          },
          {
            title: 'Videos',
            icon: 'video-outline',
            link: STUDENT_ROUTES.STUDY_MATERIAL.VIDEOS_LIST
          }
        ]
      },
      {
        title: 'Qbank',
        icon: 'hard-drive-outline',
        data: {roles: ['user', 'subscriber']},
        home: false,
        children: [
          {
            title: 'Create test',
            icon: 'edit-2-outline',
            link: STUDENT_ROUTES.TUTOR.TESTS_NEW
          },
          {
            title: 'Previous Tests',
            icon: 'list-outline',
            link: STUDENT_ROUTES.TUTOR.TESTS_LIST
          },
          {
            title: 'Performance',
            icon: 'award-outline',
            link: STUDENT_ROUTES.TUTOR.PERFORMANCE
          }
        ]
      }
    ]

    return of([...dashboardMenu, ...menu])
  }
}
