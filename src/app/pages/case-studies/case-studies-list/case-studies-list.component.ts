import {Component, OnDestroy, OnInit} from '@angular/core'
import {NbDialogService, NbMenuService, NbToastrService} from '@nebular/theme'
import {Subscription, firstValueFrom} from 'rxjs'
import {ActivatedRoute, Router} from '@angular/router'
import {ConfirmDialogComponent} from '../../../components/confirmation-dialog/confirmation-dialog.component'
import {CaseStudiesApi} from '../../../services/apis/case-studies.service'
import {CaseStudyViewComponent} from '../case-study-view/case-study-view.component'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {DatePipe} from '@angular/common'
import {Category} from '../../categories/categories.interface'

@Component({
  selector: 'ngx-case-studies-list',
  templateUrl: './case-studies-list.component.html',
  styleUrls: ['./case-studies-list.component.scss']
})
export class CaseStudiesListComponent implements OnInit, OnDestroy {
  tableColumns: any = {}

  allCategories = []
  allSubCategories = []
  category = ''
  subCategory = ''
  dataSource

  tableSettings = {
    selectMode: 'multi',
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      type: 'html',
      custom: [
        {
          name: 'view',
          title: '<i class="nb-compose" data-toggle="tooltip" data-placement="top" title="View cases tudy"></i>'
        },
        {
          name: 'edit',
          title: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit case study"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete case study"></i>'
        }
      ]
    }
  }
  tableSelectedQuestions = []
  private onItemClickSubscription: Subscription
  tableActions = [
    {title: 'Move to practice', value: 'practice'},
    {title: 'Move to exam', value: 'exam'},
    {title: 'Move to assessment', value: 'assessment'}
  ]

  constructor(
    private caseStudiesApi: CaseStudiesApi,
    private categoriesService: CategoriesApi,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: NbMenuService,
    private toasterService: NbToastrService,
    private dialogService: NbDialogService
  ) {}

  async ngOnInit() {
    await this.getCategoires()
    await this.syncQueryParams()

    this.initializeTableColumns()
    this.loadDataSource()
    this.onItemClickSubscription = this.menuService.onItemClick().subscribe(event => {
      const possibleValues = ['practice', 'exam', 'assessment']
      if (event && event.item && possibleValues.indexOf(event.item['value']) > -1) {
        this.onUserSelectMenu(event.item['value'])
      }
    })
  }

  ngOnDestroy() {
    this.onItemClickSubscription.unsubscribe()
  }

  onUserSelectMenu(type): void {
    const tableSelectedQuestionLength = this.tableSelectedQuestions.length
    if (tableSelectedQuestionLength) {
      this.dialogService
        .open(ConfirmDialogComponent, {
          context: {
            title: 'Confirm',
            message: `Are you sure you want to mark ${tableSelectedQuestionLength} item as ${type}?`
          }
        })
        .onClose.subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.updateQuestionUsage(type)
          }
        })
    } else {
      this.toasterService.danger('', `Please select at least one item to proceed!`)
    }
  }

  onUserRowSelect(event): void {
    this.tableSelectedQuestions = event.selected
  }

  updateQuestionUsage(usage) {
    const ids = this.tableSelectedQuestions.map(item => item.id)
    this.caseStudiesApi.updateUsage({ids, usage}).subscribe(res => {
      this.dataSource.refresh()
    })
  }

  private async syncQueryParams() {
    return new Promise((resolve, reject) => {
      this.route.queryParams.subscribe(params => {
        this.category = params?.category || ''
        this.subCategory = params?.subCategory || ''

        if (params.category) {
          this.allSubCategories =
            this.allCategories.find(category => category.id === this.category)?.subCategories || []
        }

        resolve(true)
      })
    })
  }

  private async getCategoires() {
    this.allCategories = await firstValueFrom(this.categoriesService.getCategories())
  }

  private loadDataSource() {
    this.dataSource = this.caseStudiesApi.caseStuidesDataSource({
      category: this.category,
      subCategory: this.subCategory
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
        editable: false,
        class: 'title-column' // Apply the custom CSS class
      },
      createdAt: {
        title: 'Added At',
        type: 'string',
        sort: true,
        filter: false,
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
          this.removeCaseStudy(event.data)
        }
      })
  }

  private openViewCaseStudyDialog(caseStudy) {
    this.dialogService.open(CaseStudyViewComponent, {
      context: {
        caseStudyId: caseStudy.id
      }
    })
  }

  private setQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.category,
        subCategory: this.subCategory
      }
    })
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'delete':
        this.onDeleteConfirm(event)
        break

      case 'edit':
        this.routeTo(`pages/case-studies/edit/${event.data.id}`)
        break

      case 'add':
        this.routeTo(`pages/case-studies/new`)
        break

      case 'view':
        this.openViewCaseStudyDialog(event.data)
        break

      default:
        break
    }
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  // External Api's call
  removeCaseStudy(data) {
    this.caseStudiesApi.delete(data.id).subscribe(res => {
      this.dataSource.refresh()
    })
  }

  categoryChange() {
    if (this.category) {
      this.subCategory = ''
      this.allSubCategories = []
      this.allSubCategories = this.allCategories.find(category => category.id === this.category)?.subCategories || []
      this.setQueryParams()
      this.loadDataSource()
    }
  }
  subCategoryChange() {
    if (this.category && this.subCategory) {
      this.setQueryParams()
      this.loadDataSource()
    }
  }
}
