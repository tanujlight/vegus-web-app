import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from './pricing.component';

import {
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbButtonModule,
} from '@nebular/theme';

const NB_MODULES = [
  NbIconModule,
  NbLayoutModule,
  NbCardModule,
  NbButtonModule,
];


@NgModule({
  declarations: [PricingComponent],
  imports: [
    CommonModule,
    PricingRoutingModule,
    ...NB_MODULES,
  ]
})
export class PricingModule { }
