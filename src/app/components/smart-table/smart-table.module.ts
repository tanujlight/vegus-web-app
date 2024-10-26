import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {Ng2SmartTableModule} from 'ng2-smart-table'
import {SmartTableComponent} from './smart-table.component'
import {
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbInputModule,
  NbTreeGridModule,
  NbSelectModule,
  NbContextMenuModule,
  NbCheckboxModule
} from '@nebular/theme'
import {ConfirmDialogModule} from '../confirmation-dialog/confirmation-dialog.module'
import {FormsModule} from '@angular/forms'
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbTreeGridModule,
    NbSelectModule,
    NbCheckboxModule,
    ConfirmDialogModule,
    NbContextMenuModule,
    Ng2SmartTableModule,
    FormsModule
  ],
  exports: [SmartTableComponent],
  declarations: [SmartTableComponent]
})
export class SmartTableModule {}
