/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NgModule} from '@angular/core'
import {MyToastService} from './my-toast.service'
import {LoaderService} from './loader.service'
import {ApiServicesModule} from './apis/api-services.module'
import {CryptoService} from './crypto.service'

@NgModule({
  imports: [ApiServicesModule],
  declarations: [],
  providers: [MyToastService, LoaderService, CryptoService]
})
export class ServicesModule {}
