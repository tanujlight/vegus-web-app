import {Component, Input, OnInit} from '@angular/core'
import {ViewCell} from 'ng2-smart-table'
import {FormBuilder, FormControl, FormGroup} from '@angular/forms' // Import reactive forms modules
import {NbSelectComponent} from '@nebular/theme' // Import NbSelectComponent
import {UserData} from 'app/@core/interfaces/common/users'
import {MyToastService} from 'app/services/my-toast.service'

@Component({
  template: `
    <nb-select fullWidth matRipple [formControl]="selectControl">
      <nb-option matRipple *ngFor="let r of statusList" [value]="r.value">{{ r.name }}</nb-option>
    </nb-select>
  `
})
export class ChangeUserStatusComponent implements ViewCell, OnInit {
  selectControl: FormControl = new FormControl() // Create a FormControl

  statusList = [
    {
      name: 'Active',
      value: 'active'
    },
    {
      name: 'Inactive',
      value: 'inactive'
    }
  ]

  @Input() value: string | number
  @Input() rowData: any

  constructor(private fb: FormBuilder, private usersService: UserData, private myToastService: MyToastService) {}

  ngOnInit() {
    this.selectControl.setValue(this.value) // Set initial value

    this.selectControl.valueChanges.subscribe(newValue => {
      const id = this.rowData.id || this.rowData._id
      this.usersService.updateStatus(id, newValue).subscribe(updatedUser => {
        if (updatedUser) {
          this.myToastService.showToast('User status updated successfully', 'Success', 'success')
        }
      })
    })
  }
}
