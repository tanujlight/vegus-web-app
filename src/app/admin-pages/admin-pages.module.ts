/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NgModule} from '@angular/core'

import {AdminPagesComponent} from './admin-pages.component'
import {AdminPagesRoutingModule} from './admin-pages-routing.module'
import {ThemeModule} from '../@theme/theme.module'
import {MiscellaneousModule} from '../miscellaneous/miscellaneous.module'
import {AdminPagesMenu} from './admin-pages-menu'
import {NbMenuModule, NbCardModule, NbIconModule} from '@nebular/theme'
import {AuthModule} from '../@auth/auth.module'
import {ConfirmDialogModule} from '../components/confirmation-dialog/confirmation-dialog.module'
import {DashboardComponent} from './dashboard/dashboard.component'

const PAGES_COMPONENTS = [AdminPagesComponent]

@NgModule({
  imports: [
    AdminPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbIconModule,
    MiscellaneousModule,
    ConfirmDialogModule,
    AuthModule.forRoot()
  ],
  declarations: [...PAGES_COMPONENTS, DashboardComponent],
  providers: [AdminPagesMenu]
})
export class PagesModule {}
