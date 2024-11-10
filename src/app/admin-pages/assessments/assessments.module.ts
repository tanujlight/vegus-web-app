import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {AssessmentsRoutingModule} from './assessments-routing.module'
import {AssessmentsComponent} from './assessments.component'
import {AssessmentComponent} from './assessment/assessment.component'
import {AssessmentListComponent} from './assessment-list/assessment-list.component'
import {AssessmentViewComponent} from './assessment-view/assessment-view.component'

import {SmartTableModule} from '../../components/smart-table/smart-table.module'
import {ScrollToTopModule} from '../../components/scroll-to-top/scroll-to-top.module'
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {TextEditorModule} from '../../components/text-editor/text-editor.module'
import {ComponentsModule} from '../../@components/components.module'
import {QuestionsAndCaseStudiesComponent} from './assessment/questions-and-case-studies/questions-and-case-studies.component'
import {AddQuestionAndCaseStudyComponent} from './assessment/add-question-and-case-study/add-question-and-case-study.component'
import {LinkRenderComponent} from './assessment/questions-and-case-studies/link-render.component'
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
  NbTimepickerModule,
  NbListModule
} from '@nebular/theme'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {ThemeModule} from '../../@theme/theme.module'
import {QuestionsModule} from '../questions/questions.module'
import {CaseStudiesModule} from '../case-studies/case-studies.module'
import {QuestionTypeViewModule} from '../../components/question-type-view/question-type-view.module'

const MATERIAL_MODULES = [MatDatepickerModule, ReactiveFormsModule, ngFormsModule]

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
  NbTimepickerModule,
  NbListModule
]

@NgModule({
  declarations: [
    AssessmentsComponent,
    AssessmentComponent,
    AssessmentListComponent,
    AssessmentViewComponent,
    QuestionsAndCaseStudiesComponent,
    AddQuestionAndCaseStudyComponent,
    LinkRenderComponent
  ],
  imports: [
    CommonModule,
    SmartTableModule,
    ScrollToTopModule,
    AssessmentsRoutingModule,
    TextEditorModule,
    QuestionTypeViewModule,
    QuestionsModule,
    CaseStudiesModule,
    ThemeModule,
    ComponentsModule,
    ...NB_MODULES,
    ...MATERIAL_MODULES
  ],
  entryComponents: [AddQuestionAndCaseStudyComponent]
})
export class AssessmentsModule {}
