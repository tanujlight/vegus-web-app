import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminGuard} from '../../@auth/admin.guard'
import { AssesmentsComponent } from './assesments.component';
import { AssesmentComponent } from './assesment/assesment.component';
import { AssesmentListComponent } from './assesment-list/assesment-list.component';

const routes: Routes = [
  {
    path: '',
    component: AssesmentsComponent,
    children: [
      {
        path: 'list',
        canActivate: [AdminGuard],
        component: AssesmentListComponent
      },
      {
        path: 'edit/:id',
        canActivate: [AdminGuard],
        component: AssesmentComponent
      },
      {
        path: 'new',
        canActivate: [AdminGuard],
        component: AssesmentComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssesmentsRoutingModule { }
