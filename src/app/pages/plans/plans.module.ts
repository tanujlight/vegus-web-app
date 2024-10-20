import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {SmartTableModule} from '../../components/smart-table/smart-table.module'
import {
  NbButtonModule,
  NbAccordionModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbCheckboxModule,
  NbToggleModule,
  NbTabsetModule,
  NbStepperModule
} from '@nebular/theme'

import { PlansRoutingModule } from './plans-routing.module';
import { PlansComponent } from './plans.component';
import { CustomNumberEditorComponent, PlanListComponent } from './plan-list/plan-list.component';

const NB_MODULES = [
  NbButtonModule,
  NbCardModule,
  NbAccordionModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbToggleModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbStepperModule
]


@NgModule({
  declarations: [PlansComponent, PlanListComponent, CustomNumberEditorComponent],
  imports: [
    CommonModule,
    PlansRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ngFormsModule,
    SmartTableModule,
    ...NB_MODULES
  ]
})
export class PlansModule { }
