import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminGuard} from '../../../@auth/admin.guard'
import { VideoComponent } from './video/video.component';
import { VideoListComponent } from './video-list/video-list.component';
import { VideosComponent } from './videos.component';
import { VideoViewComponent } from './video-view/video-view.component';

const routes: Routes = [
  {
    path: '',
    component: VideosComponent,
    children: [
      {
        path: 'list',
        component: VideoListComponent
      },
      {
        path: 'edit/:id',
        canActivate: [AdminGuard],
        component: VideoComponent
      },
      {
        path: 'new',
        canActivate: [AdminGuard],
        component: VideoComponent
      },
      {
        path: 'view',
        component: VideoViewComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
