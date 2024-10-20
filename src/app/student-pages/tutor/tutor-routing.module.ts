import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {TutorPagesComponent} from './tutor.component'
import {TutorPerformanceComponent} from './performance/performance.component'

const routes: Routes = [
  {
    path: '',
    component: TutorPagesComponent,
    children: [
      {
        path: 'tests',
        loadChildren: () => import('./tests/tests.module').then(m => m.TestsModule)
      },
      {
        path: 'performance',
        component: TutorPerformanceComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorPagesRoutingModule {}
