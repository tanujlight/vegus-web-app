/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'

import {CategoriesComponent} from './categories.component'
import {AdminGuard} from '../../@auth/admin.guard'
import {CategoriesListComponent} from './categories-list/categories-list.component'
import {CategoryComponent} from './category/category.component'

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: 'list',
        canActivate: [AdminGuard],
        component: CategoriesListComponent
      },
      {
        path: 'edit/:id',
        canActivate: [AdminGuard],
        component: CategoryComponent
      },
      {
        path: 'new',
        canActivate: [AdminGuard],
        component: CategoryComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}

export const routedComponents = [CategoriesComponent, CategoriesListComponent, CategoryComponent]
