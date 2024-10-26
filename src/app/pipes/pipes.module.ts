/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { NgModule } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { SanitizeUrlPipe } from './sanitize-url.pipe';


@NgModule({
  imports: [
  ],
  declarations: [
  SanitizeUrlPipe],
  providers: [
    CurrencyPipe,
    DatePipe,
  ],
  exports: [
    SanitizeUrlPipe
  ]
})
export class PipesModule {
}
