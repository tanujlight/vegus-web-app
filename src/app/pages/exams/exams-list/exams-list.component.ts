import {Component, OnInit} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {Router} from '@angular/router'
import {ConfirmDialogComponent} from '../../../components/confirmation-dialog/confirmation-dialog.component'
import {ExamsApi} from 'app/services/apis/exams.service'
import {Exam, ExamStatusListWithTitle} from '../exams.interface'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {Category} from '../../categories/categories.interface'
import {DatePipe} from '@angular/common'
import {ExamViewComponent} from '../exam-view/exam-view.component'

@Component({
  selector: 'ngx-exams-list',
  templateUrl: './exams-list.component.html',
  styleUrls: ['./exams-list.component.scss']
})
export class ExamsListComponent implements OnInit {
  tableColumns: any = {}

  allCategories = []

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
          name: 'reports',
          title: '<i class="nb-grid-a" data-toggle="tooltip" data-placement="top" title="View reports"></i>'
        },
        {
          name: 'view',
          title: '<i class="nb-compose" data-toggle="tooltip" data-placement="top" title="View exam"></i>'
        },
        {
          name: 'edit',
          title: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit exam"></i>'
        },
        {
          name: 'duplicate',
          title: '<i class="nb-arrow-retweet" data-toggle="tooltip" data-placement="top" title="Duplicate exam"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete exam"></i>'
        }
      ]
    }
  }

  constructor(
    private examsApi: ExamsApi,
    private categoriesService: CategoriesApi,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.getCategoires()
    this.dataSource = this.examsApi.examsDataSource
  }

  private async getCategoires() {
    return this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.allCategories = categoires

      this.initializeTableColumns()
    })
  }

  private initializeTableColumns() {
    this.tableColumns = {
      uniqueIdentifier: {
        title: 'ID',
        type: 'string',
        editable: false
      },
      title: {
        title: 'Title',
        type: 'string',
        editable: false
      },
      status: {
        title: 'Status',
        editable: false,
        filter: {
          type: 'list',
          config: {
            selectText: 'Select status',
            list: ExamStatusListWithTitle
          }
        }
      },
      startDate: {
        title: 'Start Date',
        type: 'string',
        filter: false,
        editable: false,
        valuePrepareFunction: (startDate: any) => {
          return new DatePipe('en-US').transform(startDate, 'yyyy/MM/dd hh:mm a')
        }
      },
      endDate: {
        title: 'End Date',
        type: 'string',
        filter: false,
        editable: false,
        valuePrepareFunction: (endDate: any) => {
          return new DatePipe('en-US').transform(endDate, 'yyyy/MM/dd hh:mm a')
        }
      },
      createdAt: {
        title: 'Added At',
        type: 'string',
        filter: false,
        sort: true,
        sortDirection: 'desc',
        valuePrepareFunction: (createdAt: any) => {
          return new DatePipe('en-US').transform(createdAt, 'yyyy/MM/dd')
        }
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
          this.removeExam(event.data)
        }
      })
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'delete':
        this.onDeleteConfirm(event)
        break

      case 'edit':
        this.routeTo(`pages/exams/edit/${event.data.id}`)
        break

      case 'add':
        this.routeTo(`pages/exams/new`)
        break

      case 'reports':
        this.routeTo(`pages/reports/list?examId=${event.data.id}`)
        break

      case 'view':
        this.openViewExamDialog(event.data)
        break

      case 'duplicate':
        this.dialogService
          .open(ConfirmDialogComponent, {
            context: {
              title: `Duplicate ${event.data.title}`,
              message: `Are you sure you want to duplicate ${event.data.title} exam?`,
              confirmButtonText: 'Duplicate'
            }
          })
          .onClose.subscribe((confirmed: boolean) => {
            if (confirmed) {
              this.examsApi.duplicateExam(event.data.id).subscribe(res => {
                this.routeTo(`pages/exams/edit/${res.id}`)
              })
            }
          })
        break

      default:
        break
    }
  }

  private openViewExamDialog(exam) {
    this.dialogService.open(ExamViewComponent, {
      context: {
        examId: exam.id
      },
      closeOnBackdropClick: false,
      closeOnEsc: false
    })
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  // External Api's call
  removeExam(data) {
    this.examsApi.delete(data.id).subscribe(res => {
      this.dataSource.refresh()
    })
  }
}
