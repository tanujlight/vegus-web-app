import {Component, OnInit} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {Router} from '@angular/router'
import {User, UserData} from 'app/@core/interfaces/common/users'
import {ConfirmDialogComponent} from '../../../components/confirmation-dialog/confirmation-dialog.component'
import {ChangeUserStatusComponent} from './change-user-status.component'

@Component({
  selector: 'ngx-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  tableColumns: any = {}
  dataSource

  tableSettings = {
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      type: 'html',
      custom: [
        {
          name: 'edit',
          title: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit user"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete user"></i>'
        }
      ]
    }
  }

  constructor(private usersService: UserData, private router: Router, private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.initializeTableColumns()
    this.dataSource = this.usersService.gridDataSource
  }

  private initializeTableColumns() {
    this.tableColumns = {
      uniqueIdentifier: {
        title: 'ID',
        type: 'string',
        editable: false
      },
      firstName: {
        title: 'First Name',
        type: 'string',
        editable: false
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
        editable: false
      },
      email: {
        title: 'Email',
        type: 'string',
        editable: false
      },
      phone: {
        title: 'Phone',
        type: 'string',
        editable: false
      },
      status: {
        title: 'Status',
        type: 'custom',
        renderComponent: ChangeUserStatusComponent
      }
    }
  }

  private onDeleteConfirm(event): void {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: {
          title: 'Confirm',
          message: 'Are you sure you want to delete?'
        }
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.removeUser(event.data)
        }
      })
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'delete':
        this.onDeleteConfirm(event)
        break

      case 'edit':
        this.routeTo(`pages/users/edit/${event.data.id}`)
        break

      case 'add':
        this.routeTo(`pages/users/new`)
        break

      default:
        break
    }
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  // External Api's call
  removeUser(data) {
    this.usersService.delete(data.id).subscribe(res => {
      this.dataSource.refresh()
    })
  }
}
