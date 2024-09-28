import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {NgxEchartsModule} from 'ngx-echarts'
import {TutorPagesRoutingModule} from './tutor-routing.module'
import {TutorPagesComponent} from './tutor.component'
import {ThemeModule} from '../../@theme/theme.module'
import {ScrollToTopModule} from '../../components/scroll-to-top/scroll-to-top.module'
import {
  NbMenuModule,
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbTreeGridModule,
  NbProgressBarModule
} from '@nebular/theme'
import {AuthModule} from '../../@auth/auth.module'
import {FsIconComponent, TutorPerformanceComponent} from './performance/performance.component'
import {MeasureConverterPipe} from '../../@theme/pipes'
import {ConfirmDialogModule} from '../../components/confirmation-dialog/confirmation-dialog.module'

const PAGES_COMPONENTS = [TutorPagesComponent, TutorPerformanceComponent]

@NgModule({
  imports: [
    CommonModule,
    TutorPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbTreeGridModule,
    ScrollToTopModule,
    NbProgressBarModule,
    NgxEchartsModule,
    ConfirmDialogModule,
    AuthModule.forRoot()
  ],
  declarations: [...PAGES_COMPONENTS, FsIconComponent],
  providers: [MeasureConverterPipe]
})
export class TutorModule {}
