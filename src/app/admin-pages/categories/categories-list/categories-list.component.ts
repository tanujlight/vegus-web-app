import {Component, OnInit} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {Router} from '@angular/router'
import {ConfirmDialogComponent} from '../../../components/confirmation-dialog/confirmation-dialog.component'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {Category} from '../categories.interface'
import {DatePipe} from '@angular/common'

@Component({
  selector: 'ngx-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  tableColumns: any = {}
  categories = []
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
          title: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit category"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete category"></i>'
        }
      ]
    }
  }

  constructor(private categoriesApi: CategoriesApi, private router: Router, private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.initializeTableColumns()
    this.getCategoires()
  }

  private initializeTableColumns() {
    this.tableColumns = {
      // uniqueIdentifier: {
      //   title: 'ID',
      //   type: 'string',
      //   editable: false
      // },
      name: {
        title: 'Name',
        type: 'string',
        sort: true,
        sortDirection: 'asc',
        editable: false
      }
      // description: {
      //   title: 'Description',
      //   type: 'string',
      //   editable: false
      // },
      // isActiveString: {
      //   title: 'Active',
      //   filter: {
      //     type: 'list',
      //     config: {
      //       selectText: 'Select status',
      //       list: [
      //         {value: 'Yes', title: 'Yes'},
      //         {value: 'No', title: 'No'}
      //       ]
      //     }
      //   }
      // }
      // createdAt: {
      //   title: 'Added At',
      //   type: 'string',
      //   valuePrepareFunction: (createdAt: any) => {
      //     return new DatePipe('en-US').transform(createdAt, 'yyyy/MM/dd')
      //   }
      // }
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
          this.removeCategory(event.data)
        }
      })
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'delete':
        this.onDeleteConfirm(event)
        break

      case 'edit':
        this.routeTo(`admin/categories/edit/${event.data.id}`)
        break

      case 'add':
        this.routeTo(`admin/categories/new`)
        break

      default:
        break
    }
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  // External Api's call
  removeCategory(data) {
    this.categoriesApi.delete(data.id).subscribe(res => {
      this.categories = this.categories.filter(c => c.id !== data.id)
    })
  }

  getCategoires() {
    this.categoriesApi.list({}).subscribe((categoires: Category[]) => {
      this.categories = categoires
      this.categories.map(category => {
        category.isActiveString = category.isActive ? 'Yes' : 'No'
      })
    })
  }
}
