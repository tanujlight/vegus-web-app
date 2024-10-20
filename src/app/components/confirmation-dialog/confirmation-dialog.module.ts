import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'

import {NbCardModule, NbIconModule, NbButtonModule} from '@nebular/theme'
import {ConfirmDialogComponent} from './confirmation-dialog.component'

@NgModule({
  imports: [CommonModule, ThemeModule, NbCardModule, NbIconModule, NbButtonModule],
  exports: [ConfirmDialogComponent],
  declarations: [ConfirmDialogComponent]
})
export class ConfirmDialogModule {}
