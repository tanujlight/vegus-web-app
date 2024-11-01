/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'

import {WebsiteComponent} from './website.component'
import {RefundPolicyComponent} from './refund-policy/refund-policy.component'
import {TermsAndConditionsComponent} from './terms-and-conditions/terms-and-conditions.component'
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component'
import {AboutUsComponent} from './about-us/about-us.component'
import {HomeComponent} from './home/home.component'
import { CheckoutComponent } from './checkout/checkout.component'

const routes: Routes = [
  {
    path: '',
    component: WebsiteComponent,
    children: [
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'refund-policy',
        component: RefundPolicyComponent
      },
      {
        path: 'terms-and-conditions',
        component: TermsAndConditionsComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: '',
        component: HomeComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule {}
