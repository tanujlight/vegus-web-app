import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {ComponentsModule} from '../../@components/components.module'
import {SmartTableModule} from '../../components/smart-table/smart-table.module'

import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbStepperModule,
  NbDatepickerModule
} from '@nebular/theme'

import {PipesModule} from '../../pipes/pipes.module'
import {QuestionsModule} from '../../pages/questions/questions.module'
import {CaseStudiesModule} from '../../pages/case-studies/case-studies.module'
import {QuestionTypeViewModule} from 'app/components/question-type-view/question-type-view.module'
import {ReportsRoutingModule} from './reports-routing.module'
import {ReportsComponent} from './reports.component'
import {ReportsListComponent} from './reports-list/reports-list.component'
import {ReportViewComponent} from './report-view/report-view.component'
import {ScrollToTopModule} from 'app/components/scroll-to-top/scroll-to-top.module'

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
  NbDatepickerModule
]

@NgModule({
  declarations: [ReportsComponent, ReportsListComponent, ReportViewComponent],
  imports: [
    CommonModule,
    ThemeModule,
    ReportsRoutingModule,
    QuestionsModule,
    CaseStudiesModule,
    QuestionTypeViewModule,
    ComponentsModule,
    SmartTableModule,
    ScrollToTopModule,
    PipesModule,
    ...NB_MODULES
  ]
})
export class ReportsModule {}
