import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../@theme/theme.module'
import {RefundPolicyComponent} from './refund-policy/refund-policy.component'
import {WebsiteComponent} from './website.component'
import {WebsiteRoutingModule} from './website-routing.module'
import {TermsAndConditionsComponent} from './terms-and-conditions/terms-and-conditions.component'
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component'
import {HomeComponent} from './home/home.component'
import {AboutUsComponent} from './about-us/about-us.component'
import {HeaderComponent} from './@components/header/header.component'
import {FooterComponent} from './@components/footer/footer.component'
import {
  NbLayoutModule,
  NbActionsModule,
  NbBadgeModule,
  NbCardModule,
  NbIconModule,
  NbTabsetModule
} from '@nebular/theme'
import {JoinUsSectionComponent} from './@components/join-us-section/join-us-section.component'

@NgModule({
  declarations: [
    RefundPolicyComponent,
    WebsiteComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    HomeComponent,
    AboutUsComponent,
    HeaderComponent,
    FooterComponent,
    JoinUsSectionComponent
  ],
  imports: [
    WebsiteRoutingModule,
    CommonModule,
    ThemeModule,
    NbLayoutModule,
    NbIconModule,
    NbActionsModule,
    NbBadgeModule,
    NbCardModule,
    NbTabsetModule
  ]
})
export class WebsiteModule {}
