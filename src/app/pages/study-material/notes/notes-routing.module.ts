import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesComponent } from './notes.component';
import {AdminGuard} from '../../../@auth/admin.guard';
import { NoteComponent } from './note/note.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteViewComponent } from './note-view/note-view.component';

const routes: Routes = [
  {
    path: '',
    component: NotesComponent,
    children: [
      {
        path: 'list',
        component: NoteListComponent
      },
      {
        path: 'edit/:id',
        canActivate: [AdminGuard],
        component: NoteComponent
      },
      {
        path: 'new',
        canActivate: [AdminGuard],
        component: NoteComponent
      },
      {
        path: 'view',
        component: NoteViewComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
