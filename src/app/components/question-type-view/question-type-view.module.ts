import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {DragDropModule} from '@angular/cdk/drag-drop'
import {ComponentsModule} from 'app/@components/components.module'
import {MatIconModule} from '@angular/material/icon'
import {MultipleChoiceComponent} from './multiple-choice/multiple-choice.component'
import {MultipleResponseComponent} from './multiple-response/multiple-response.component'
import {AudioComponent} from './audio/audio.component'
import {VideoComponent} from './video/video.component'
import {ChartExhibitComponent} from './chart-exhibit/chart-exhibit.component'
import {FillInTheBlanksComponent} from './fill-in-the-blanks/fill-in-the-blanks.component'
import {DragDropOrderedResponseComponent} from './drag-drop-ordered-response/drag-drop-ordered-response.component'
import {DragDropDyadsViewComponent} from './drag-drop-dyads/drag-drop-dyads.component'
import {DropDownTableComponent} from './drop-down-table/drop-down-table.component'
import {MatrixMultipleChoiceComponent} from './matrix-multiple-choice/matrix-multiple-choice.component'
import {MatrixMultipleResponseComponent} from './matrix-multiple-response/matrix-multiple-response.component'
import {
  NbRadioModule,
  NbAccordionModule,
  NbCheckboxModule,
  NbButtonModule,
  NbListModule,
  NbIconModule,
  NbCardModule,
  NbPopoverModule
} from '@nebular/theme'
import {PipesModule} from '../../pipes/pipes.module'
import {FormsModule} from '@angular/forms'
import {MultipleResponseNComponent} from './multiple-response-n/multiple-response-n.component'
import {ExplanationComponent} from './explanation/explanation.component'
import {MultipleResponseGroupingComponent} from './multiple-response-grouping/multiple-response-grouping.component'
import {QuestionViewRendererComponent} from './question-view-renderer.component'
import {GraphicInAnswerComponent} from './graphic-in-answer/graphic-in-answer.component'
import {GraphicInQuestionComponent} from './graphic-in-question/graphic-in-question.component'
import {DropDownClozeComponent} from './drop-down-cloze/drop-down-cloze.component'
import {DragDropClozeComponent} from './drag-drop-cloze/drag-drop-cloze.component'
import {HighlightTextComponent} from './highlight-text/highlight-text.component'
import {HighlightTableComponent} from './highlight-table/highlight-table.component'
import {BowTieComponent} from './bow-tie/bow-tie.component'

import {DropDownDyadsComponent} from './drop-down-dyads/drop-down-dyads.component'
import {DropDownTriadsComponent} from './drop-down-triads/drop-down-triads.component'
import {DragDropTriadsViewComponent} from './drag-drop-triads/drag-drop-triads.component'

const NB_MODULES = [
  NbRadioModule,
  NbAccordionModule,
  NbCheckboxModule,
  NbButtonModule,
  NbListModule,
  NbIconModule,
  NbCardModule,
  NbPopoverModule
]

@NgModule({
  declarations: [
    MultipleChoiceComponent,
    MultipleResponseComponent,
    AudioComponent,
    VideoComponent,
    ChartExhibitComponent,
    FillInTheBlanksComponent,
    DragDropOrderedResponseComponent,
    DropDownTableComponent,
    MatrixMultipleChoiceComponent,
    MatrixMultipleResponseComponent,
    MultipleResponseNComponent,
    ExplanationComponent,
    MultipleResponseGroupingComponent,
    QuestionViewRendererComponent,
    GraphicInAnswerComponent,
    GraphicInQuestionComponent,
    DropDownClozeComponent,
    DragDropClozeComponent,
    HighlightTextComponent,
    DragDropDyadsViewComponent,
    HighlightTableComponent,
    BowTieComponent,
    DropDownDyadsComponent,
    DropDownTriadsComponent,
    DragDropTriadsViewComponent
  ],
  imports: [...NB_MODULES, CommonModule, FormsModule, PipesModule, DragDropModule, MatIconModule, ComponentsModule],
  exports: [
    MultipleChoiceComponent,
    MultipleResponseComponent,
    AudioComponent,
    VideoComponent,
    ChartExhibitComponent,
    FillInTheBlanksComponent,
    DragDropOrderedResponseComponent,
    DropDownTableComponent,
    MatrixMultipleChoiceComponent,
    MatrixMultipleResponseComponent,
    DragDropDyadsViewComponent,
    MultipleResponseNComponent,
    MultipleResponseGroupingComponent,
    ExplanationComponent,
    QuestionViewRendererComponent,
    DropDownDyadsComponent,
    DropDownTriadsComponent,
    DragDropTriadsViewComponent
  ]
})
export class QuestionTypeViewModule {}
