import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {AdminGuard} from '../../@auth/admin.guard'
import {FlashCardsComponent} from './flash-cards.component'
import {FlashCardsListComponent} from './flash-cards-list/flash-cards-list.component'

const routes: Routes = [
  {
    path: '',
    component: FlashCardsComponent,
    children: [
      {
        path: 'list',
        component: FlashCardsListComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlashCardsRoutingModule {}

export const routedComponents = [FlashCardsComponent, FlashCardsListComponent]
