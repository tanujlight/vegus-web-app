import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryAccordianViewComponent } from './category-accordian-view.component';
import {ThemeModule} from '../../@theme/theme.module'
import {
  NbCardModule,
  NbAccordionModule,
} from '@nebular/theme'

const NB_MODULES = [
  NbCardModule,
  NbAccordionModule,
]



@NgModule({
  declarations: [CategoryAccordianViewComponent],
  imports: [
    CommonModule,
    ThemeModule,
    ...NB_MODULES,
  ],
  exports: [
    CategoryAccordianViewComponent,
  ]
})
export class CategoryAccordianViewModule { }
