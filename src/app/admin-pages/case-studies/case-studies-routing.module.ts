import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {AdminGuard} from '../../@auth/admin.guard'
import {CaseStudiesComponent} from './case-studies.component'
import {CaseStudiesListComponent} from './case-studies-list/case-studies-list.component'
import {CaseStudyComponent} from './case-study/case-study.component'
import {QuestionComponent} from '../questions/question/question.component'
import { CaseStudiesListViewComponent } from './case-studies-list-view/case-studies-list-view.component'

const routes: Routes = [
  {
    path: '',
    component: CaseStudiesComponent,
    children: [
      {
        path: 'list-view',
        canActivate: [AdminGuard],
        component: CaseStudiesListViewComponent
      },
      {
        path: 'list',
        canActivate: [AdminGuard],
        component: CaseStudiesListComponent
      },
      {
        path: 'edit/:id',
        canActivate: [AdminGuard],
        component: CaseStudyComponent
      },
      {
        path: 'new',
        canActivate: [AdminGuard],
        component: CaseStudyComponent
      },
      {
        path: 'edit/:caseStudyId/questions/:id',
        canActivate: [AdminGuard],
        component: QuestionComponent
      },
      {
        path: 'edit/:caseStudyId/questions/new',
        canActivate: [AdminGuard],
        component: QuestionComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseStudiesRoutingModule {}

export const routedComponents = [CaseStudyComponent, CaseStudiesListComponent, CaseStudiesComponent]
