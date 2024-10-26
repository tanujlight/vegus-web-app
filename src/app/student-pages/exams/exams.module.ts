import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ComponentsModule} from 'app/@components/components.module'

import {ExamsRoutingModule} from './exams-routing.module'
import {ExamsComponent} from './exams.component'
import {ExamsListComponent} from './exams-list/exams-list.component'
import {ExamComponent} from './exam/exam.component'
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbStepperModule,
  NbDatepickerModule,
  NbPopoverModule
} from '@nebular/theme'
import {QuestionsModule} from '../../admin-pages/questions/questions.module'
import {CaseStudiesModule} from '../../admin-pages/case-studies/case-studies.module'
import {CalculatorModule} from '../../components/calculator/calculator.module'
import {QuestionTypeViewModule} from 'app/components/question-type-view/question-type-view.module'

const NB_MODULES = [
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbStepperModule,
  NbDatepickerModule,
  NbPopoverModule
]
@NgModule({
  declarations: [ExamsComponent, ExamsListComponent, ExamComponent],
  imports: [
    CommonModule,
    ExamsRoutingModule,
    QuestionTypeViewModule,
    QuestionsModule,
    CaseStudiesModule,
    CalculatorModule,
    NbPopoverModule,
    ComponentsModule,
    ...NB_MODULES
  ]
})
export class ExamsModule {}
