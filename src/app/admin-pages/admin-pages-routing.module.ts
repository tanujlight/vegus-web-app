/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'

import {AdminPagesComponent} from './admin-pages.component'
import {NotFoundComponent} from '../miscellaneous/not-found/not-found.component'
import {DashboardComponent} from './dashboard/dashboard.component'

const routes: Routes = [
  {
    path: '',
    component: AdminPagesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'questions',
        loadChildren: () => import('./questions/questions.module').then(m => m.QuestionsModule)
      },
      {
        path: 'case-studies',
        loadChildren: () => import('./case-studies/case-studies.module').then(m => m.CaseStudiesModule)
      },
      {
        path: 'exams',
        loadChildren: () => import('./exams/exams.module').then(m => m.ExamsModule)
      },
      {
        path: 'assesments',
        loadChildren: () => import('./assesments/assesments.module').then(m => m.AssesmentsModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'flash-cards',
        loadChildren: () => import('./flash-cards/flash-cards.module').then(m => m.FlashCardsModule)
      },
      {
        path: 'plans',
        loadChildren: () => import('./plans/plans.module').then(m => m.PlansModule)
      },
      {
        path: 'study-material',
        loadChildren: () => import('./study-material/study-material.module').then(m => m.StudyMaterialModule)
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
export class AdminPagesRoutingModule {}
