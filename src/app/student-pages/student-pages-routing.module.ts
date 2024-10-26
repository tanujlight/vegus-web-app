/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'
import {RoleGuard} from '../@auth/role.guard'
import {StudentPagesComponent} from './student-pages.component'
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component'
import {DashboardComponent} from './dashboard/dashboard.component'

const routes: Routes = [
  {
    path: '',
    component: StudentPagesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        loadChildren: () => import('../admin-pages/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'subscription',
        canActivate: [RoleGuard],
        data: {roles: ['subscriber']},
        loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule)
      },
      {
        path: 'exams',
        canActivate: [RoleGuard],
        data: {roles: ['user']},
        loadChildren: () => import('./exams/exams.module').then(m => m.ExamsModule)
      },
      {
        path: 'reports',
        canActivate: [RoleGuard],
        data: {roles: ['user']},
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'flash-cards',
        loadChildren: () => import('../admin-pages/flash-cards/flash-cards.module').then(m => m.FlashCardsModule)
      },
      {
        path: 'study-material',
        loadChildren: () =>
          import('../admin-pages/study-material/study-material.module').then(m => m.StudyMaterialModule)
      },
      {
        path: 'tutor',
        loadChildren: () => import('./tutor/tutor.module').then(m => m.TutorModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentPagesRoutingModule {}
