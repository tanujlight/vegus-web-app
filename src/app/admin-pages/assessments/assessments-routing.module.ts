import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {AdminGuard} from '../../@auth/admin.guard'
import {AssessmentsComponent} from './assessments.component'
import {AssessmentComponent} from './assessment/assessment.component'
import {AssessmentListComponent} from './assessment-list/assessment-list.component'

const routes: Routes = [
  {
    path: '',
    component: AssessmentsComponent,
    children: [
      {
        path: 'list',
        canActivate: [AdminGuard],
        component: AssessmentListComponent
      },
      {
        path: 'edit/:id',
        canActivate: [AdminGuard],
        component: AssessmentComponent
      },
      {
        path: 'new',
        canActivate: [AdminGuard],
        component: AssessmentComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentsRoutingModule {}
