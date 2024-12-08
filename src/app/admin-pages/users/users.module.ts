/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'

import {ThemeModule} from '../../@theme/theme.module'
import {UsersRoutingModule, routedComponents} from './users-routing.module'
import {AuthModule} from '../../@auth/auth.module'
import {MatDatepickerModule} from '@angular/material/datepicker'

// components
import {ComponentsModule} from '../../@components/components.module'
import {ProfilePhotoComponent} from './profile-photo/profile-photo.component'
import {SmartTableModule} from '../../components/smart-table/smart-table.module'
import {ChangeUserStatusComponent} from './users-list/change-user-status.component'
// components

import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbSpinnerModule,
  NbDatepickerModule,
  NbCheckboxModule
} from '@nebular/theme'
import {ScrollToTopModule} from 'app/components/scroll-to-top/scroll-to-top.module'

const NB_MODULES = [
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbCheckboxModule,
  NbListModule,
  NbIconModule,
  NbSpinnerModule,
  NbDatepickerModule,
  NbInputModule
]

@NgModule({
  imports: [
    ThemeModule,
    AuthModule,
    UsersRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    SmartTableModule,
    ScrollToTopModule,
    ...NB_MODULES
  ],
  declarations: [...routedComponents, ChangeUserStatusComponent, ProfilePhotoComponent],
  entryComponents: [],
  providers: []
})
export class UsersModule {}
