/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NgModule} from '@angular/core'
import {CaseStudiesApi} from './case-studies.service'
import {CategoriesApi} from './categories.service'
import {ExamsApi} from './exams.service'
import {ReportsApi} from './reports.service'
import {QuestionsApi} from './questions.service'
import {FlashCardsApi} from './flash-cards.service'
import {PlansApi} from './plans.service'

@NgModule({
  imports: [],
  declarations: [],
  providers: [CaseStudiesApi, CategoriesApi, ExamsApi, QuestionsApi, ReportsApi, FlashCardsApi, PlansApi]
})
export class ApiServicesModule {}
