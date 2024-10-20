/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import {Component, OnDestroy, OnInit} from '@angular/core'
import {AnalyticsService} from './@core/utils'
import {InitUserService} from './@theme/services/init-user.service'
import {Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'
import {Router, RouteConfigLoadStart, RouteConfigLoadEnd} from '@angular/router'

import {LoaderService} from './services/loader.service'

@Component({
  selector: 'ngx-app',
  styleUrls: ['./app.component.scss'],
  template: `
    <router-outlet></router-outlet>
    <app-my-loader></app-my-loader>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>()

  constructor(
    private analytics: AnalyticsService,
    private initUserService: InitUserService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.initUser()
  }

  ngOnInit(): void {
    this.analytics.trackPageViews()

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loaderService.isLoading.next(true)
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loaderService.isLoading.next(false)
      }
    })
  }

  initUser() {
    this.initUserService.initCurrentUser().pipe(takeUntil(this.destroy$)).subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
