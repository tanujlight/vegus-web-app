import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssesmentsRoutingModule } from './assesments-routing.module';
import { AssesmentsComponent } from './assesments.component';
import { AssesmentComponent } from './assesment/assesment.component';
import { AssesmentListComponent } from './assesment-list/assesment-list.component';
import { AssesmentViewComponent } from './assesment-view/assesment-view.component';


import {SmartTableModule} from '../../components/smart-table/smart-table.module'
import {ScrollToTopModule} from '../../components/scroll-to-top/scroll-to-top.module'
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {TextEditorModule} from '../../components/text-editor/text-editor.module'
import {ComponentsModule} from '../../@components/components.module'
import {QuestionsAndCaseStudiesComponent} from './assesment/questions-and-case-studies/questions-and-case-studies.component'
import {AddQuestionAndCaseStudyComponent} from './assesment/add-question-and-case-study/add-question-and-case-study.component'
import {LinkRenderComponent} from './assesment/questions-and-case-studies/link-render.component'
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
    AssesmentsComponent,
    AssesmentComponent,
    AssesmentListComponent,
    AssesmentViewComponent,
    QuestionsAndCaseStudiesComponent,
    AddQuestionAndCaseStudyComponent,
    LinkRenderComponent,
  ],
  imports: [
    CommonModule,
    SmartTableModule,
    ScrollToTopModule,
    AssesmentsRoutingModule,
    TextEditorModule,
    ComponentsModule,
    ...NB_MODULES,
    ...MATERIAL_MODULES
  ]
})
export class AssesmentsModule { }
