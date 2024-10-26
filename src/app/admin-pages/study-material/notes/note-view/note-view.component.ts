import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {QuestionsApi} from 'app/services/apis/questions.service'
import {NbDialogRef} from '@nebular/theme'

@Component({
  selector: 'ngx-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss']
})
export class NoteViewComponent implements OnInit {
  @Input() fileUrl: string
  @Input() title: string
  @Input() uniqueIdentifier: string

  constructor(
    private cdr: ChangeDetectorRef,
    protected dialogRef: NbDialogRef<NoteViewComponent>
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.dialogRef.close()
  }

}
