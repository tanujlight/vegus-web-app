/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {NgModule} from '@angular/core'
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {CoreModule} from './@core/core.module'

import {AppComponent} from './app.component'
import {AppRoutingModule} from './app-routing.module'
import {ThemeModule} from './@theme/theme.module'
import {AuthModule} from './@auth/auth.module'

import {LoaderInterceptor} from './interceptors/loader-interceptor.service'
import {MyLoaderComponent} from './components/my-loader/my-loader.component'

import {
  NbChatModule,
  NbDatepickerModule,
  NbTimepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule
} from '@nebular/theme'

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

import {ServicesModule} from './services/services.module'
import {PipesModule} from './pipes/pipes.module'
import {DirectiveModule} from './directives/directive.module'

@NgModule({
  declarations: [AppComponent, MyLoaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    AuthModule.forRoot(),
    MatProgressSpinnerModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY'
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    ServicesModule,
    PipesModule,
    DirectiveModule
  ],
  bootstrap: [AppComponent],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true}]
})
export class AppModule {}
