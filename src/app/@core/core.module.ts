/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MAT_RIPPLE_GLOBAL_OPTIONS} from '@angular/material/core'
import {NbAuthModule} from '@nebular/auth'

import {throwIfAlreadyLoaded} from './module-import-guard'
import {AnalyticsService, LayoutService, PlayerService, RippleService, StateService} from './utils'

import {CommonBackendModule} from './backend/common/common-backend.module'
import {CommonMockModule} from './mock/common/common-mock.module'
import {EcommerceMockModule} from './mock/ecommerce/ecommerce-mock.module'
import {IotMockModule} from './mock/iot/iot-mock.module'
import {UserStore} from './stores/user.store'
import {CategoriesStore} from './stores/categories.store'
import {UsersService} from './backend/common/services/users.service'
import {SettingsService} from './backend/common/services/settings.service'
import {InitUserService} from '../@theme/services/init-user.service'

export const NB_CORE_PROVIDERS = [
  ...CommonMockModule.forRoot().providers,
  ...CommonBackendModule.forRoot().providers,

  ...EcommerceMockModule.forRoot().providers,
  ...IotMockModule.forRoot().providers,

  AnalyticsService,
  LayoutService,
  PlayerService,
  StateService,
  {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: RippleService}
]

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule')
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS, UserStore, UsersService, InitUserService, SettingsService, CategoriesStore]
    }
  }
}
