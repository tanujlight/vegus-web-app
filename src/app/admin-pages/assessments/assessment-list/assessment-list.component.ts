import {Component, OnInit} from '@angular/core'
import {NbDialogService} from '@nebular/theme'
import {Router} from '@angular/router'
import {ConfirmDialogComponent} from '../../../components/confirmation-dialog/confirmation-dialog.component'
import {AssessmentsApi} from 'app/services/apis/assessments.service'
import {Assessment, AssessmentStatusListWithTitle} from '../assessments.interface'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {Category} from '../../categories/categories.interface'
import {DatePipe} from '@angular/common'
import {AssessmentViewComponent} from '../assessment-view/assessment-view.component'

@Component({
  selector: 'ngx-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {
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
        // {
        //   name: 'reports',
        //   title: '<i class="nb-grid-a" data-toggle="tooltip" data-placement="top" title="View reports"></i>'
        // },
        {
          name: 'view',
          title: '<i class="nb-compose" data-toggle="tooltip" data-placement="top" title="View assessment"></i>'
        },
        {
          name: 'edit',
          title: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit assessment"></i>'
        },
        // {
        //   name: 'duplicate',
        //   title: '<i class="nb-arrow-retweet" data-toggle="tooltip" data-placement="top" title="Duplicate assessment"></i>'
        // },
        {
          name: 'delete',
          title: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete assessment"></i>'
        }
      ]
    }
  }

  constructor(
    private assessmentsService: AssessmentsApi,
    private categoriesService: CategoriesApi,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.getCategoires()
    this.dataSource = this.assessmentsService.assessmentsDataSource
  }

  private async getCategoires() {
    return this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.allCategories = categoires

      this.initializeTableColumns()
    })
  }

  private initializeTableColumns() {
    this.tableColumns = {
      // uniqueIdentifier: {
      //   title: 'ID',
      //   type: 'string',
      //   editable: false
      // },
      title: {
        title: 'Title',
        type: 'string',
        editable: false
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
          this.removeAssessment(event.data)
        }
      })
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'delete':
        this.onDeleteConfirm(event)
        break

      case 'edit':
        this.routeTo(`admin/assessments/edit/${event.data.id}`)
        break

      case 'add':
        this.routeTo(`admin/assessments/new`)
        break

      case 'reports':
        this.routeTo(`admin/reports/list?examId=${event.data.id}`)
        break

      case 'view':
        this.openViewAssessmentDialog(event.data)
        break

      // case 'duplicate':
      //   this.dialogService
      //     .open(ConfirmDialogComponent, {
      //       context: {
      //         title: `Duplicate ${event.data.title}`,
      //         message: `Are you sure you want to duplicate ${event.data.title} assessment?`,
      //         confirmButtonText: 'Duplicate'
      //       }
      //     })
      //     .onClose.subscribe((confirmed: boolean) => {
      //       if (confirmed) {
      //         this.assessmentsService.duplicateAssessment(event.data.id).subscribe(res => {
      //           this.routeTo(`admin/assessments/edit/${res.id}`)
      //         })
      //       }
      //     })
      //   break

      default:
        break
    }
  }

  private openViewAssessmentDialog(assessment) {
    this.dialogService.open(AssessmentViewComponent, {
      context: {
        assessmentId: assessment.id
      },
      closeOnBackdropClick: false,
      closeOnEsc: false
    })
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  // External Api's call
  removeAssessment(data) {
    this.assessmentsService.delete(data.id).subscribe(res => {
      this.dataSource.refresh()
    })
  }
}
