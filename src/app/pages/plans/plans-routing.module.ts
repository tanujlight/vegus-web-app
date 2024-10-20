import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlansComponent } from './plans.component';

const routes: Routes = [
  {
    path: '',
    component: PlansComponent,
    children: [
      {
        path: 'list',
        component: PlanListComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlansRoutingModule { }
