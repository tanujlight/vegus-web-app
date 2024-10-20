import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {CaseStudyViewRendererComponent} from './case-study-view-renderer/case-study-view-renderer.component'
import {ComponentsModule} from '../../../@components/components.module'
import {MatTabsModule} from '@angular/material/tabs'

import {
  NbRadioModule,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbTabsetModule,
  NbStepperModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbAccordionModule
} from '@nebular/theme'
import {QuestionViewRendererComponent} from './question-view-renderer/question-view-renderer.component'
import {ExplanationComponent} from './explanation/explanation.component'
import {ViewMultipleChoiceComponent} from './question-view/view-multiple-choice/view-multiple-choice.component'
import {ViewMultipleResponseComponent} from './question-view/view-multiple-response/view-multiple-response.component'
import {ViewChartExhibitComponent} from './question-view/view-chart-exhibit/view-chart-exhibit.component'
import {ViewFillInTheBlanksComponent} from './question-view/view-fill-in-the-blanks/view-fill-in-the-blanks.component'
import {ViewMultipleResponseNComponent} from './question-view/view-multiple-response-n/view-multiple-response-n.component'
import {ViewAudioComponent} from './question-view/view-audio/view-audio.component'
import {ViewVideoComponent} from './question-view/view-video/view-video.component'
import {ViewDragDropOrderedResponseComponent} from './question-view/view-drag-drop-ordered-response/view-drag-drop-ordered-response.component'
import {ViewMatrixMultipleChoiceComponent} from './question-view/view-matrix-multiple-choice/view-matrix-multiple-choice.component'
import {ViewMatrixMultipleResponseComponent} from './question-view/view-matrix-multiple-response/view-matrix-multiple-response.component'
import {ViewMultipleResponseGroupingComponent} from './question-view/view-multiple-response-grouping/view-multiple-response-grouping.component'
import {ViewDropDownTableComponent} from './question-view/view-drop-down-table/view-drop-down-table.component'
import {ViewGraphicInQuestionComponent} from './question-view/view-graphic-in-question/view-graphic-in-question.component'
import {ViewGraphicInAnswerComponent} from './question-view/view-graphic-in-answer/view-graphic-in-answer.component'
import {ViewDropDownClozeComponent} from './question-view/view-drop-down-cloze/view-drop-down-cloze.component'
import {ViewDragDropClozeComponent} from './question-view/view-drag-drop-cloze/view-drag-drop-cloze.component'
import {ViewDragDropDyadsComponent} from './question-view/view-drag-drop-dyads/view-drag-drop-dyads.component'
import {ViewDropDownDyadsComponent} from './question-view/view-drop-down-dyads/view-drop-down-dyads.component'
import {ViewDropDownTriadsComponent} from './question-view/view-drop-down-triads/view-drop-down-triads.component'
import {ViewDragDropTriadsComponent} from './question-view/view-drag-drop-triads/view-drag-drop-triads.component'
import {ViewHighlightTextComponent} from './question-view/view-highlight-text/view-highlight-text.component'
import {ViewHighlightTableComponent} from './question-view/view-highlight-table/view-highlight-table.component'
import {ViewBowTieComponent} from './question-view/view-bow-tie/view-bow-tie.component'
import {DragDropModule} from '@angular/cdk/drag-drop'
import {FormsModule} from '@angular/forms'
import {MatIconModule} from '@angular/material/icon'
import {PipesModule} from 'app/pipes/pipes.module'
import {NavigatorComponent} from './navigator/navigator.component'
import {Ng2SmartTableModule} from 'ng2-smart-table'

const NB_MODULES = [
  NbRadioModule,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbTabsetModule,
  NbStepperModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbAccordionModule
]

const COMMON_COMPONENTS = [
  CaseStudyViewRendererComponent,
  QuestionViewRendererComponent,
  ExplanationComponent,
  ViewMultipleChoiceComponent,
  ViewMultipleResponseComponent,
  ViewChartExhibitComponent,
  ViewFillInTheBlanksComponent,
  ViewMultipleResponseNComponent,
  ViewAudioComponent,
  ViewVideoComponent,
  ViewDragDropOrderedResponseComponent,
  ViewMatrixMultipleChoiceComponent,
  ViewMatrixMultipleResponseComponent,
  ViewMultipleResponseGroupingComponent,
  ViewDropDownTableComponent,
  ViewGraphicInQuestionComponent,
  ViewGraphicInAnswerComponent,
  ViewDropDownClozeComponent,
  ViewDragDropClozeComponent,
  ViewDragDropDyadsComponent,
  ViewDropDownDyadsComponent,
  ViewDropDownTriadsComponent,
  ViewDragDropTriadsComponent,
  ViewHighlightTextComponent,
  ViewHighlightTableComponent,
  ViewBowTieComponent
]

@NgModule({
  declarations: [...COMMON_COMPONENTS, NavigatorComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    DragDropModule,
    FormsModule,
    ComponentsModule,
    PipesModule,
    MatIconModule,
    Ng2SmartTableModule,
    ...NB_MODULES
  ],
  exports: [...COMMON_COMPONENTS]
})
export class CommmonModule {}
