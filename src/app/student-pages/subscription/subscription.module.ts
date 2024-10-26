import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {SubscriptionComponent} from './subscription.component'
import {PlansComponent} from './plans/plans.component'
import {SubscriptionRoutingModule} from './subscription-routing.module'
import {NgxEchartsModule} from 'ngx-echarts'
import {ThemeModule} from '../../@theme/theme.module'
import {
  NbMenuModule,
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbTreeGridModule,
  NbTabsetModule,
  NbProgressBarModule
} from '@nebular/theme'
import {AuthModule} from '../../@auth/auth.module'
import {CheckoutComponent} from './checkout/checkout.component'
import {CheckoutCancelComponent} from './checkout/checkout-cancel.component'
import {CheckoutSuccessComponent} from './checkout/checkout-success.component'

const PAGES_COMPONENTS = [
  SubscriptionComponent,
  PlansComponent,
  CheckoutComponent,
  CheckoutCancelComponent,
  CheckoutSuccessComponent
]

@NgModule({
  declarations: [...PAGES_COMPONENTS],
  imports: [
    SubscriptionRoutingModule,
    CommonModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbTreeGridModule,
    NbTabsetModule,
    NbProgressBarModule,
    NgxEchartsModule,
    AuthModule.forRoot()
  ]
})
export class SubscriptionModule {}
