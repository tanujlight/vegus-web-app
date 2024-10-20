import {NgModule} from '@angular/core'
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {AuthModule} from '../../@auth/auth.module'
import {ComponentsModule} from '../../@components/components.module'

import {
  NbButtonModule,
  NbAccordionModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbCheckboxModule,
  NbMenuModule,
  NbDialogModule
} from '@nebular/theme'
import {TextEditorModule} from '../../components/text-editor/text-editor.module'
import {ScrollToTopModule} from '../../components/scroll-to-top/scroll-to-top.module'

import {SmartTableModule} from '../../components/smart-table/smart-table.module'

import {QuestionsRoutingModule, routedComponents} from './questions-routing.module'

import {CategoriesModule} from '../categories/categories.module'
import {MultipleChoiceComponent} from './question/multiple-choice/multiple-choice.component'
import {MultipleResponseComponent} from './question/multiple-response/multiple-response.component'
import {ChartExhibitComponent} from './question/chart-exhibit/chart-exhibit.component'
import {FillInTheBlanksComponent} from './question/fill-in-the-blanks/fill-in-the-blanks.component'
import {MultipleResponseNComponent} from './question/multiple-response-n/multiple-response-n.component'
import {DragDropOrderedResponseComponent} from './question/drag-drop-ordered-response/drag-drop-ordered-response.component'
import {AudioComponent} from './question/audio/audio.component'
import {VideoComponent} from './question/video/video.component'
import {PipesModule} from '../../pipes/pipes.module'
import {MatrixMultipleChoiceComponent} from './question/matrix-multiple-choice/matrix-multiple-choice.component'
import {MatrixMultipleResponseComponent} from './question/matrix-multiple-response/matrix-multiple-response.component'
import {QuestionsListComponent} from './questions-list/questions-list.component'
import {QuestionComponent} from './question/question.component'
import {QuestionViewComponent} from './question-view/question-view.component'
import {DropDownTableComponent} from './question/drop-down-table/drop-down-table.component'
import {MatChipsModule} from '@angular/material/chips'
import {MultipleResponseGroupingComponent} from './question/multiple-response-grouping/multiple-response-grouping.component'
import {DropDownClozeComponent} from './question/drop-down-cloze/drop-down-cloze.component'
import {GraphicInQuestionComponent} from './question/graphic-in-question/graphic-in-question.component'
import {QuestionTypeViewModule} from '../../components/question-type-view/question-type-view.module'
import {GraphicInAnswerComponent} from './question/graphic-in-answer/graphic-in-answer.component'
import {DragDropClozeComponent} from './question/drag-drop-cloze/drag-drop-cloze.component'
import {HighlightTextComponent} from './question/highlight-text/highlight-text.component'
import {HighlightTableComponent} from './question/highlight-table/highlight-table.component'
import {BowTieComponent} from './question/bow-tie/bow-tie.component'
import {DragDropDyadsComponent} from './question/drag-drop-dyads/drag-drop-dyads.component'
import {DropDownDyadsComponent} from './question/drop-down-dyads/drop-down-dyads.component'
import {DropDownTriadsComponent} from './question/drop-down-triads/drop-down-triads.component'
import {DragDropTriadsComponent} from './question/drag-drop-triads/drag-drop-triads.component';
import { QuestionsListViewComponent } from './questions-list-view/questions-list-view.component'

const NB_MODULES = [
  NbButtonModule,
  NbAccordionModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbCheckboxModule,
  NbDialogModule.forChild()
]

@NgModule({
  declarations: [
    ...routedComponents,
    MultipleChoiceComponent,
    MultipleResponseComponent,
    ChartExhibitComponent,
    FillInTheBlanksComponent,
    MultipleResponseNComponent,
    DragDropOrderedResponseComponent,
    AudioComponent,
    VideoComponent,
    MatrixMultipleChoiceComponent,
    MatrixMultipleResponseComponent,
    DropDownTableComponent,
    MultipleResponseGroupingComponent,
    GraphicInQuestionComponent,
    QuestionViewComponent,
    GraphicInAnswerComponent,
    DropDownClozeComponent,
    DragDropClozeComponent,
    HighlightTextComponent,
    HighlightTableComponent,
    BowTieComponent,
    DragDropDyadsComponent,
    DropDownDyadsComponent,
    DropDownTriadsComponent,
    DragDropTriadsComponent,
    QuestionsListViewComponent
  ],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    ThemeModule,
    AuthModule,
    ComponentsModule,
    ReactiveFormsModule,
    ngFormsModule,
    SmartTableModule,
    CategoriesModule,
    TextEditorModule,
    PipesModule,
    MatChipsModule,
    NbSelectModule,
    ScrollToTopModule,
    QuestionTypeViewModule,
    NbMenuModule,
    ...NB_MODULES
  ],
  entryComponents: [QuestionViewComponent, QuestionComponent],
  providers: [],
  exports: [QuestionsListComponent, QuestionComponent, QuestionViewComponent]
})
export class QuestionsModule {}
