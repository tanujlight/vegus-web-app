import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ScrollToTopComponent} from './scroll-to-top.component'
import {NbIconModule} from '@nebular/theme'

@NgModule({
  imports: [CommonModule, NbIconModule],
  exports: [ScrollToTopComponent],
  declarations: [ScrollToTopComponent]
})
export class ScrollToTopModule {}
