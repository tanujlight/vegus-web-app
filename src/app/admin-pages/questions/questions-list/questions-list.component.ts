import {Component, OnInit, Input, OnDestroy} from '@angular/core'
import {NbDialogService, NbMenuService, NbToastrService} from '@nebular/theme'
import {Subscription, firstValueFrom} from 'rxjs'
import {ActivatedRoute, Router} from '@angular/router'
import {ConfirmDialogComponent} from '../../../components/confirmation-dialog/confirmation-dialog.component'
import {QuestionsApi} from 'app/services/apis/questions.service'
import {QuestionViewComponent} from '../question-view/question-view.component'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {QuestionTypesListWithTitle} from '../questions.interface'
import {DomSanitizer, SafeHtml} from '@angular/platform-browser'
import {DatePipe} from '@angular/common'
import {QuestionComponent} from '../question/question.component'

@Component({
  selector: 'ngx-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  @Input() isDialog?: boolean = false
  @Input() caseStudyId: string = ''
  @Input() caseStudy

  category = ''
  subCategory = ''
  dataSource

  tableColumns: any = {}

  allCategories = []
  allSubCategories = []
  tableSelectedQuestions = []

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
          title: '<i class="nb-compose" data-toggle="tooltip" data-placement="top" title="View question"></i>'
        },
        {
          name: 'edit',
          title: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit question"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete question"></i>'
        }
      ]
    }
  }
  private onItemClickSubscription: Subscription
  tableActions = []

  constructor(
    private sanitizer: DomSanitizer,
    private questionsApi: QuestionsApi,
    private toasterService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
    private categoriesService: CategoriesApi
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

  private async getCategoires() {
    this.allCategories = await firstValueFrom(this.categoriesService.getCategories())
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

  private sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
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
        type: 'html',
        editable: false,
        class: 'title-column', // Apply the custom CSS class
        valuePrepareFunction: (cell, row) => {
          return this.sanitizeHtml(cell || '')
        }
      },
      type: {
        title: 'Type',
        type: 'string',
        editable: false,
        width: '30px',
        filter: {
          type: 'list',
          config: {
            selectText: 'Select question type',
            list: QuestionTypesListWithTitle
          }
        }
      }
    }

    if (this.caseStudyId) {
      this.tableColumns['selectedCaseStudyTabs'] = {
        title: 'Case Study Tabs',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          let string = ''
          cell.forEach(tab => {
            const tabData = this.caseStudy?.tabs.find(t => t._id === tab)
            if (tabData) {
              string += tabData.title + ' | '
            }
          })

          return string.slice(0, -3)
        }
      }
      this.tableSettings['selectMode'] = null
    } else {
      this.tableActions = [
        {title: 'Move to practice', value: 'practice'},
        {title: 'Move to exam', value: 'exam'},
        {title: 'Move to assessment', value: 'assessment'}
      ]
    }

    this.tableColumns['createdAt'] = {
      title: 'Added At',
      type: 'string',
      filter: false,
      valuePrepareFunction: (createdAt: any) => {
        return new DatePipe('en-US').transform(createdAt, 'yyyy/MM/dd')
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
          this.removeQuestion(event.data)
        }
      })
  }

  private openViewQuestionDialog(question) {
    this.dialogService.open(QuestionViewComponent, {
      context: {
        questionId: question.id
      },
      closeOnBackdropClick: false,
      closeOnEsc: false
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

  private loadDataSource() {
    this.dataSource = this.questionsApi.questionsDataSource({
      caseStudyId: this.caseStudyId,
      category: this.caseStudyId ? '' : this.category,
      subCategory: this.caseStudyId ? '' : this.subCategory
    })
  }

  onUserRowSelect(event): void {
    this.tableSelectedQuestions = event.selected
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

  // External Api's call
  updateQuestionUsage(usage) {
    const ids = this.tableSelectedQuestions.map(item => item._id)
    this.questionsApi.updateUsage({ids, usage}).subscribe(res => {
      this.dataSource.refresh()
    })
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'delete':
        this.onDeleteConfirm(event)
        break

      case 'edit':
        if (this.caseStudyId) {
          if (this.isDialog) {
            this.editCaseStudyItemInModal(event.data.id)
          } else {
            this.routeTo(`admin/case-studies/edit/${this.caseStudyId}/questions/${event.data.id}`)
          }
        } else {
          this.routeTo(`admin/questions/edit/${event.data.id}`)
        }
        break

      case 'add':
        if (this.caseStudyId) {
          this.routeTo(`admin/case-studies/edit/${this.caseStudyId}/questions/new`)
        } else {
          this.routeTo(`admin/questions/new`)
        }
        break

      case 'view':
        this.openViewQuestionDialog(event.data)
        break

      default:
        break
    }
  }

  editCaseStudyItemInModal(questionId) {
    this.dialogService
      .open(QuestionComponent, {
        context: {
          isDialog: true,
          questionItemId: questionId,
          caseStudyItemId: this.caseStudyId
        },
        dialogClass: 'question-component-dialog-container',
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(addedQuestion => {
        if (addedQuestion) {
          this.loadDataSource()
        }
      })
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  // External Api's call
  removeQuestion(data) {
    this.questionsApi.delete(data.id).subscribe(res => {
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
