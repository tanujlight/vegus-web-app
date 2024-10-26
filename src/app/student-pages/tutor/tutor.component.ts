/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, OnDestroy, OnInit, HostListener} from '@angular/core'
import {NbMenuItem} from '@nebular/theme'
import {InitUserService} from '../../@theme/services/init-user.service'
import {UserStore} from 'app/@core/stores/user.store'

@Component({
  selector: 'ngx-tutor',
  template: ` <router-outlet></router-outlet>`
})
export class TutorPagesComponent implements OnInit, OnDestroy {
  menu: NbMenuItem[]
  alive: boolean = true

  constructor(protected initUserService: InitUserService, protected userStore: UserStore) {}

  ngOnInit(): void {}

  initMenu() {}

  ngOnDestroy(): void {}
}
