import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {AssessmentsRoutingModule} from './assessments-routing.module'
import {AssessmentsComponent} from './assessments.component'
import {AssessmentComponent} from './assessment/assessment.component'
import {AssessmentListComponent} from './assessment-list/assessment-list.component'
import {
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbStepperModule,
  NbDatepickerModule,
  NbBadgeModule,
  NbTooltipModule,
  NbAccordionModule,
  NbPopoverModule,
  NbListModule
} from '@nebular/theme'
import {QuestionsModule} from '../../admin-pages/questions/questions.module'
import {CaseStudiesModule} from '../../admin-pages/case-studies/case-studies.module'
import {CalculatorModule} from '../../components/calculator/calculator.module'
import {QuestionTypeViewModule} from 'app/components/question-type-view/question-type-view.module'
import {ComponentsModule} from 'app/@components/components.module'
import {CommmonModule} from './common/common.module'
import {TimerModule} from '../../components/timer/timer.module'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {ReactiveFormsModule} from '@angular/forms'
import {ScrollingModule} from '@angular/cdk/scrolling'
import {PipesModule} from '../../pipes/pipes.module'
import {SmartTableModule} from '../../components/smart-table/smart-table.module'
import {TextEditorModule} from '../../components/text-editor/text-editor.module'
import {AuthModule} from '../../@auth/auth.module'
import {ThemeModule} from '../../@theme/theme.module';
import { ReportViewComponent } from './report-view/report-view.component';

const NB_MODULES = [
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbStepperModule,
  NbDatepickerModule,
  NbBadgeModule,
  NbTooltipModule,
  NbAccordionModule,
  NbPopoverModule,
  NbListModule
]
const MATERIAL_MODULES = [MatDatepickerModule, ReactiveFormsModule]

@NgModule({
  declarations: [AssessmentsComponent, AssessmentComponent, AssessmentListComponent, ReportViewComponent],
  imports: [
    CommonModule,
    AssessmentsRoutingModule,
    QuestionTypeViewModule,
    QuestionsModule,
    CaseStudiesModule,
    CalculatorModule,
    ComponentsModule,
    CommmonModule,
    TimerModule,
    ScrollingModule,
    SmartTableModule,
    TextEditorModule,
    PipesModule,
    ThemeModule,
    AuthModule,
    ...NB_MODULES,
    ...MATERIAL_MODULES
  ]
})
export class AssessmentsModule {}
