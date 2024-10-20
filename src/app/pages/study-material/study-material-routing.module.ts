import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudyMaterialComponent } from './study-material.component';
import {NotFoundComponent} from '../miscellaneous/not-found/not-found.component'

const routes: Routes = [
  {
    path: '',
    component: StudyMaterialComponent,
    children: [
      {
        path: 'notes',
        loadChildren: () => import('./notes/notes.module').then(m => m.NotesModule)
      },
      {
        path: 'videos',
        loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule)
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyMaterialRoutingModule { }
