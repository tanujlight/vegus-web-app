import {NgModule} from '@angular/core'
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {AuthModule} from '../../@auth/auth.module'
import {ComponentsModule} from '../../@components/components.module'
import {ScrollingModule} from '@angular/cdk/scrolling'

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

import {SmartTableModule} from '../../components/smart-table/smart-table.module'
import {TextEditorModule} from '../../components/text-editor/text-editor.module'
import {ScrollToTopModule} from '../../components/scroll-to-top/scroll-to-top.module'

import {ExamsRoutingModule, routedComponents} from './exams-routing.module'

import {PipesModule} from '../../pipes/pipes.module'
import {QuestionsAndCaseStudiesComponent} from './exam/questions-and-case-studies/questions-and-case-studies.component'
import {AddQuestionAndCaseStudyComponent} from './exam/add-question-and-case-study/add-question-and-case-study.component'
import {LinkRenderComponent} from './exam/questions-and-case-studies/link-render.component'
import {ExamViewComponent} from './exam-view/exam-view.component'
import {QuestionsModule} from '../questions/questions.module'
import {CaseStudiesModule} from '../case-studies/case-studies.module'
import {QuestionTypeViewModule} from '../../components/question-type-view/question-type-view.module'

const MATERIAL_MODULES = [MatDatepickerModule, ReactiveFormsModule]

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
  imports: [
    CommonModule,
    ScrollingModule,
    ExamsRoutingModule,
    ThemeModule,
    AuthModule,
    ComponentsModule,
    ngFormsModule,
    SmartTableModule,
    PipesModule,
    NbSelectModule,
    QuestionTypeViewModule,
    QuestionsModule,
    CaseStudiesModule,
    TextEditorModule,
    ScrollToTopModule,
    ...NB_MODULES,
    ...MATERIAL_MODULES
  ],
  declarations: [
    ...routedComponents,
    QuestionsAndCaseStudiesComponent,
    AddQuestionAndCaseStudyComponent,
    LinkRenderComponent,
    ExamViewComponent
  ],
  providers: [],
  exports: [],
  entryComponents: [AddQuestionAndCaseStudyComponent]
})
export class ExamsModule {}
