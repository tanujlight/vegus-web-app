import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {CalculatorComponent} from './calculator.component'
import {MatCardModule} from '@angular/material/card'
import {
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbInputModule,
  NbTreeGridModule,
  NbSelectModule,
  NbCheckboxModule
} from '@nebular/theme'
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
    FormsModule,
    MatCardModule
  ],
  exports: [CalculatorComponent],
  declarations: [CalculatorComponent]
})
export class CalculatorModule {}
