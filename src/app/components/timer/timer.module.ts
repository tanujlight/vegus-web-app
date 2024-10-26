import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {FormsModule} from '@angular/forms'
import {CountUpTimerComponent} from './countup-timer.component'

@NgModule({
  imports: [CommonModule, ThemeModule, FormsModule],
  exports: [CountUpTimerComponent],
  declarations: [CountUpTimerComponent]
})
export class TimerModule {}
