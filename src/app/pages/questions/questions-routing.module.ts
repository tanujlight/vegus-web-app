import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {AdminGuard} from '../../@auth/admin.guard'
import {QuestionsComponent} from './questions.component'
import {QuestionsListComponent} from './questions-list/questions-list.component'
import {QuestionComponent} from './question/question.component'
import { QuestionsListViewComponent } from './questions-list-view/questions-list-view.component'

const routes: Routes = [
  {
    path: '',
    component: QuestionsComponent,
    children: [
      {
        path: 'list-view',
        canActivate: [AdminGuard],
        component: QuestionsListViewComponent
      },
      {
        path: 'list',
        canActivate: [AdminGuard],
        component: QuestionsListComponent
      },
      {
        path: 'edit/:id',
        canActivate: [AdminGuard],
        component: QuestionComponent
      },
      {
        path: 'new',
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
export class QuestionsRoutingModule {}

export const routedComponents = [QuestionsComponent, QuestionsListComponent, QuestionComponent]
