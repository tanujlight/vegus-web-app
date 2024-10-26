import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {ReportsComponent} from './reports.component'
import {ReportsListComponent} from './reports-list/reports-list.component'
import {ReportViewComponent} from './report-view/report-view.component'

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'list',
        component: ReportsListComponent
      },
      {
        path: 'view/:reportId',
        component: ReportViewComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}

export const routedComponents = [ReportsComponent, ReportsListComponent, ReportViewComponent]
