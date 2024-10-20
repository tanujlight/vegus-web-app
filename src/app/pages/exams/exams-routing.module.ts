import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {AdminGuard} from '../../@auth/admin.guard'
import {ExamsComponent} from './exams.component'
import {ExamsListComponent} from './exams-list/exams-list.component'
import {ExamComponent} from './exam/exam.component'

const routes: Routes = [
  {
    path: '',
    component: ExamsComponent,
    children: [
      {
        path: 'list',
        canActivate: [AdminGuard],
        component: ExamsListComponent
      },
      {
        path: 'edit/:id',
        canActivate: [AdminGuard],
        component: ExamComponent
      },
      {
        path: 'new',
        canActivate: [AdminGuard],
        component: ExamComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamsRoutingModule {}

export const routedComponents = [ExamComponent, ExamsListComponent, ExamsComponent]
