import { Component, Input, OnInit } from '@angular/core';
import {NbDialogRef} from '@nebular/theme'

@Component({
  selector: 'ngx-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit {
  @Input() fileUrl: string
  @Input() title: string
  @Input() uniqueIdentifier: string

  constructor(
    protected dialogRef: NbDialogRef<VideoViewComponent>
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.dialogRef.close()
  }

}
