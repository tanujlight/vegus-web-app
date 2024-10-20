import {Component, Inject} from '@angular/core'
import {NbDialogRef, NB_DIALOG_CONFIG} from '@nebular/theme'

@Component({
  template: `
    <nb-card>
      <nb-card-header>{{ title }}</nb-card-header>
      <nb-card-body>{{ message }}</nb-card-body>
      <nb-card-footer>
        <button nbButton status="danger" (click)="confirm()">{{ confirmButtonText }}</button>&nbsp;
        <button nbButton status="primary" (click)="cancel()">{{ cancelButtonText }}</button>
      </nb-card-footer>
    </nb-card>
  `
})
export class ConfirmDialogComponent {
  title: string
  message: string

  confirmButtonText: string = 'Confirm'
  cancelButtonText: string = 'Cancel'

  constructor(protected dialogRef: NbDialogRef<ConfirmDialogComponent>, @Inject(NB_DIALOG_CONFIG) config: any) {
    this.title = config.title
    this.message = config.message
  }

  confirm() {
    this.dialogRef.close(true)
  }

  cancel() {
    this.dialogRef.close(false)
  }
}
