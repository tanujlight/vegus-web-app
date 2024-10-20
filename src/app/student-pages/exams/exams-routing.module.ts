import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamsListComponent } from './exams-list/exams-list.component';
import { ExamsComponent } from './exams.component';
import { ExamComponent } from './exam/exam.component';

const routes: Routes = [
  {
    path: '',
    component: ExamsComponent,
    children: [
      {
        path: 'list',
        component: ExamsListComponent
      },
      {
        path: ':examId',
        component: ExamComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamsRoutingModule { }
