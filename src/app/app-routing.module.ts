/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {ExtraOptions, RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'
import {AuthGuard} from './@auth/auth.guard'

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('app/admin-pages/admin-pages.module').then(m => m.PagesModule)
  },
  {
    path: 'student',
    canActivate: [AuthGuard],
    loadChildren: () => import('app/student-pages/student-pages.module').then(m => m.StudentPagesModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('app/@auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () => import('app/website/website.module').then(m => m.WebsiteModule)
  },
  {path: '**', redirectTo: ''}
]

const config: ExtraOptions = {
  useHash: false
}

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
