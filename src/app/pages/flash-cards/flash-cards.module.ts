import {NgModule} from '@angular/core'
import {FormsModule as ngFormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {AuthModule} from '../../@auth/auth.module'
import {ComponentsModule} from '../../@components/components.module'

import {
  NbButtonModule,
  NbAccordionModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbCheckboxModule,
  NbStepperModule
} from '@nebular/theme'
import {TextEditorModule} from '../../components/text-editor/text-editor.module'

import {SmartTableModule} from '../../components/smart-table/smart-table.module'

import {FlashCardsRoutingModule, routedComponents} from './flash-cards-routing.module'
import {FlashCardComponent} from './flash-card/flash-card.component'

import {PipesModule} from '../../pipes/pipes.module'

const NB_MODULES = [
  NbButtonModule,
  NbCardModule,
  NbAccordionModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbCheckboxModule,
  NbStepperModule
]

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    AuthModule,
    ComponentsModule,
    ReactiveFormsModule,
    ngFormsModule,
    SmartTableModule,
    FlashCardsRoutingModule,
    TextEditorModule,
    PipesModule,
    ...NB_MODULES
  ],
  declarations: [...routedComponents, FlashCardComponent],
  entryComponents: [FlashCardComponent],
  providers: [],
  exports: []
})
export class FlashCardsModule {}
