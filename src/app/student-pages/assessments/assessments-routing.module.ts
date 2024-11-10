import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {AssessmentsComponent} from './assessments.component'
import {AssessmentListComponent} from './assessment-list/assessment-list.component'
import {AssessmentComponent} from './assessment/assessment.component'
import { ReportViewComponent } from './report-view/report-view.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentsComponent,
    children: [
      {
        path: 'list',
        component: AssessmentListComponent
      },
      {
        path: ':assessmentId',
        component: AssessmentComponent
      },
      {
        path: 'report/:assessmentId',
        component: ReportViewComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentsRoutingModule {}
