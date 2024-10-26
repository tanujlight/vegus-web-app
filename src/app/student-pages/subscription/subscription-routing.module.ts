import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {PlansComponent} from './plans/plans.component'
import {SubscriptionComponent} from './subscription.component'
import {CheckoutComponent} from './checkout/checkout.component'
import {CheckoutSuccessComponent} from './checkout/checkout-success.component'
import {CheckoutCancelComponent} from './checkout/checkout-cancel.component'
import {NotFoundComponent} from 'app/miscellaneous/not-found/not-found.component'

const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent,
    children: [
      {
        path: 'plans',
        component: PlansComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'checkout/success',
        component: CheckoutSuccessComponent
      },
      {
        path: 'checkout/cancel',
        component: CheckoutCancelComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule {}
