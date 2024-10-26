import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosRoutingModule } from './videos-routing.module';
import { VideosComponent } from './videos.component';
import { VideoComponent } from './video/video.component';
import { VideoListComponent } from './video-list/video-list.component';
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
import { VideoViewComponent } from './video-view/video-view.component'
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
  declarations: [VideosComponent, VideoComponent, VideoListComponent, VideoViewComponent],
  imports: [
    CommonModule,
    VideosRoutingModule,
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
    ...MATERIAL_MODULES
  ]
})
export class VideosModule { }
