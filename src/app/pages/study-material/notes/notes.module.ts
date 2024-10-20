import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';
import { NoteComponent } from './note/note.component';
import { NoteListComponent } from './note-list/note-list.component';
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {ScrollingModule} from '@angular/cdk/scrolling'
import {ThemeModule} from '../../../@theme/theme.module'
import {AuthModule} from '../../../@auth/auth.module'
import {ComponentsModule} from '../../../@components/components.module'
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
  NbAccordionModule,
  NbPopoverModule
} from '@nebular/theme'
import {MatDatepickerModule} from '@angular/material/datepicker'

import {SmartTableModule} from '../../../components/smart-table/smart-table.module'
import {TextEditorModule} from '../../../components/text-editor/text-editor.module'
import {ScrollToTopModule} from '../../../components/scroll-to-top/scroll-to-top.module'
import {PipesModule} from '../../../pipes/pipes.module';
import { NoteViewComponent } from './note-view/note-view.component'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CategoryAccordianViewModule } from 'app/components/category-accordian-view/category-accordian-view.module';
import { CategorySubcategoryBreadcrumbsModule } from 'app/components/category-subcategory-breadcrumbs/category-subcategory-breadcrumbs.module';

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
  NbAccordionModule,
  NbPopoverModule
]


@NgModule({
  declarations: [NotesComponent, NoteComponent, NoteListComponent, NoteViewComponent],
  imports: [
    CommonModule,
    NotesRoutingModule,
    CommonModule,
    ScrollingModule,
    ThemeModule,
    AuthModule,
    ComponentsModule,
    ngFormsModule,
    SmartTableModule,
    PipesModule,
    NbSelectModule,
    TextEditorModule,
    ScrollToTopModule,
    CategoryAccordianViewModule,
    CategorySubcategoryBreadcrumbsModule,
    ...NB_MODULES,
    PdfViewerModule,
    ...MATERIAL_MODULES
  ]
})
export class NotesModule { }
