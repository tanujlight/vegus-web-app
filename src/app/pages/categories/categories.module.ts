import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {ThemeModule} from '../../@theme/theme.module'
import {AuthModule} from '../../@auth/auth.module'
import {ComponentsModule} from '../../@components/components.module'

// components
import {SmartTableModule} from '../../components/smart-table/smart-table.module'
import {CategoriesRoutingModule, routedComponents} from './categories-routing.module'

import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbCheckboxModule
} from '@nebular/theme'
import {SubcategoriesComponent} from './category/subcategories/subcategories.component'
import {ScrollToTopModule} from 'app/components/scroll-to-top/scroll-to-top.module'

const NB_MODULES = [
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
  NbCheckboxModule
]

@NgModule({
  declarations: [...routedComponents, SubcategoriesComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ThemeModule,
    AuthModule,
    ScrollToTopModule,
    ComponentsModule,
    ReactiveFormsModule,
    SmartTableModule,
    ...NB_MODULES
  ],
  entryComponents: [],
  providers: []
})
export class CategoriesModule {}
