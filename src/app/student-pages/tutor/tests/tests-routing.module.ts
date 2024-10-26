import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {TestsComponent} from './tests.component'
import {TestListComponent} from './test-list/test-list.component'
import {CreateTestComponent} from './create-test/create-test.component'
import {TakeTestComponent} from './take-test/take-test.component'

const routes: Routes = [
  {
    path: '',
    component: TestsComponent,
    children: [
      {
        path: 'list',
        component: TestListComponent
      },
      {
        path: 'view/:testId',
        component: TakeTestComponent
      },
      {
        path: 'new',
        component: CreateTestComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule {}
