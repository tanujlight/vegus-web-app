import {NgModule} from '@angular/core'
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../../@theme/theme.module'
import {AuthModule} from '../../../@auth/auth.module'
import {ComponentsModule} from '../../../@components/components.module'
import {ScrollingModule} from '@angular/cdk/scrolling'

import {TestsRoutingModule} from './tests-routing.module'
import {TestsComponent} from './tests.component'
import {TestListComponent} from './test-list/test-list.component'
import {CreateTestComponent} from './create-test/create-test.component'
import {TimerModule} from '../../../components/timer/timer.module'
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbListModule,
  NbStepperModule,
  NbDatepickerModule,
  NbPopoverModule,
  NbBadgeModule,
  NbAccordionModule,
  NbTooltipModule
} from '@nebular/theme'
import {MatDatepickerModule} from '@angular/material/datepicker'

import {SmartTableModule} from '../../../components/smart-table/smart-table.module'
import {TextEditorModule} from '../../../components/text-editor/text-editor.module'
import {ScrollToTopModule} from '../../../components/scroll-to-top/scroll-to-top.module'
import {PipesModule} from '../../../pipes/pipes.module'
import {TakeTestComponent} from './take-test/take-test.component'
import {CommmonModule} from '../common/common.module'
import {CalculatorModule} from '../../../components/calculator/calculator.module'

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
  NbBadgeModule,
  NbTooltipModule,
  NbAccordionModule,
  NbPopoverModule,
  NbListModule
]

@NgModule({
  declarations: [TestsComponent, TestListComponent, CreateTestComponent, TakeTestComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    TestsRoutingModule,
    TimerModule,
    ThemeModule,
    AuthModule,
    ComponentsModule,
    ngFormsModule,
    SmartTableModule,
    PipesModule,
    NbSelectModule,
    CalculatorModule,
    CommmonModule,
    TextEditorModule,
    ScrollToTopModule,
    ...NB_MODULES,
    ...MATERIAL_MODULES
  ]
})
export class TestsModule {}
