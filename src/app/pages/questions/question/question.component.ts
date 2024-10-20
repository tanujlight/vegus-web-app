import {Component, OnInit, OnDestroy, Input, Optional} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {Location} from '@angular/common'
import {Observable, Subject} from 'rxjs'
import ObjectId from 'bson-objectid'
import {takeUntil} from 'rxjs/operators'
import {NbDialogRef} from '@nebular/theme'

import {NbToastrService} from '@nebular/theme'

import {QuestionsApi} from 'app/services/apis/questions.service'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {Category} from '../../categories/categories.interface'
import {QuestionTypesListWithTitle, IQuestionTypeWithTitle, EQuestionType} from '../questions.interface'
import {CaseStudiesApi} from '../../../services/apis/case-studies.service'

export enum QuestionFormMode {
  EDIT = 'Edit',
  ADD = 'Add'
}

@Component({
  selector: 'ngx-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, OnDestroy {
  @Input() isDialog?: boolean = false
  @Input() questionItemId?: string
  @Input() caseStudyItemId?: string

  public EQuestionType = EQuestionType
  submitClicked: Subject<void> = new Subject<void>()
  questionForm: FormGroup
  questionId: string
  caseStudyId: string
  caseStudy = null
  selectedCaseStudyTabs = []
  selectedCaseStudyTabsIds = []
  categories = []
  subCategories = []
  examUsage = {
    practice: false,
    exam: false,
    assessment: false,
  };
  explanation = ''
  title = ''
  questionTypes: IQuestionTypeWithTitle[] = []
  question = null

  protected readonly unsubscribe$ = new Subject<void>()

  get type() {
    return this.questionForm.get('type')
  }

  mode: QuestionFormMode
  setViewMode(viewMode: QuestionFormMode) {
    this.mode = viewMode
  }

  constructor(
    public questionsService: QuestionsApi,
    private _location: Location,
    private route: ActivatedRoute,
    private toasterService: NbToastrService,
    private categoriesService: CategoriesApi,
    private caseStudiessService: CaseStudiesApi,
    private fb: FormBuilder,
    @Optional() protected componentRef: NbDialogRef<QuestionComponent>
  ) {
    this.questionTypes = QuestionTypesListWithTitle
    this.caseStudyId = null
  }

  async ngOnInit() {
    this.getCategoires()
    this.caseStudyId = this.route.snapshot.paramMap.get('caseStudyId')
    if (!this.caseStudyId && this.caseStudyItemId) {
      this.caseStudyId = this.caseStudyItemId;
    }

    this.initQuestionForm()
    this.loadQuestionData()
  }

  private getCategoires() {
    this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.categories = categoires
    })
  }

  private async getCaseStudy() {
    return new Promise((resolve, reject) => {
      this.caseStudiessService.get(this.caseStudyId).subscribe(caseStudy => {
        this.caseStudy = caseStudy
        resolve(true)
      })
    })
  }

  private setSelectedCasaeStudyTabs() {
    this.selectedCaseStudyTabs = this.caseStudy?.tabs.filter(tab => this.selectedCaseStudyTabsIds.includes(tab._id))
  }

  /**
   * Load question data, in edit mode
   */
  private loadQuestion(id?) {
    this.questionsService.get(id).subscribe(question => {
      this.questionForm.setValue({
        id: question._id || '',
        uniqueIdentifier: question.uniqueIdentifier || '',
        category: question.category?.id || null,
        subCategory: question.subCategory || null,
        type: question.type
      })
      this.question = question
      this.title = question.title
      this.explanation = question.explanation
      if (question.examUsage) {
        this.examUsage = question.examUsage
      }
      this.subCategories = question.category?.subCategories || []
      this.selectedCaseStudyTabsIds = question.selectedCaseStudyTabs || []

      this.setSelectedCasaeStudyTabs()
    })
  }

  categoryChange() {
    if (this.questionForm.value.category) {
      this.subCategories = []
      const selectedCategory = this.categories.find(category => category.id === this.questionForm.value.category)
      if (selectedCategory) {
        this.subCategories = selectedCategory.subCategories
      }
    }
  }

  changeCaseStudyTabs(event) {
    this.selectedCaseStudyTabsIds = event
    this.selectedCaseStudyTabs = this.caseStudy?.tabs.filter(tab => this.selectedCaseStudyTabsIds.includes(tab._id))
  }

  initQuestionForm() {
    const formGroup = {
      id: this.fb.control(''),
      uniqueIdentifier: this.fb.control(''),
      type: this.fb.control({value: '', disabled: false}, [Validators.required])
    }

    if (!this.caseStudyId) {
      formGroup['category'] = this.fb.control('', [Validators.required])
      formGroup['subCategory'] = this.fb.control('', [Validators.required])
    } else {
      formGroup['category'] = this.fb.control(null)
      formGroup['subCategory'] = this.fb.control(null)
    }

    this.questionForm = this.fb.group(formGroup)
  }

  async loadQuestionData() {
    if (this.caseStudyId) await this.getCaseStudy()

    /**
     * If id is exist, it means that we are in edit mode
     */
    const questionId = this.route.snapshot.paramMap.get('id')

    if ((questionId && questionId !== 'new') || this.questionItemId) {
      this.questionId = this.questionItemId ? this.questionItemId : questionId;
      this.setViewMode(QuestionFormMode.EDIT)
      this.loadQuestion(this.questionId)
      this.questionForm.get('type').disable()
    } else {
      this.setViewMode(QuestionFormMode.ADD)
      this.questionId = new ObjectId().toHexString()
    }
  }

  convertToQuestion(value: any) {
    const question = value
    return question
  }

  submit() {
    this.submitClicked.next()
  }

  save(event) {
    const sendData = {
      ...this.questionForm.value,
      ...event,
      title: this.title,
      explanation: this.explanation,
      caseStudy: this.caseStudyId || null,
      examUsage: this.examUsage,
      selectedCaseStudyTabs: this.selectedCaseStudyTabsIds
    }

    if (this.caseStudyId) {
      sendData['caseStudy'] = this.caseStudyId
      sendData['selectedCaseStudyTabs'] = this.selectedCaseStudyTabsIds

      if (this.selectedCaseStudyTabsIds.length === 0) {
        this.toasterService.danger('', `Please select at least one case study tab!`)
        return
      }
    }

    let observable = new Observable()

    if (this.mode === QuestionFormMode.EDIT) {
      observable = this.questionsService.update(sendData)
    } else {
      sendData._id = this.questionId
      observable = this.questionsService.add(sendData)
    }

    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      data => {
        this.handleSuccessResponse(data)
      },
      err => {
        this.handleWrongResponse()
      }
    )
  }

  handleSuccessResponse(data) {
    let message = ''
    switch (this.mode) {
      case QuestionFormMode.ADD:
        message = 'Question created!'
        break
      case QuestionFormMode.EDIT:
        message = 'Question updated!'
        break
      default:
        message = 'Question updated!'
    }
    this.toasterService.success('', message)
    this.back(data)
  }

  handleWrongResponse() {
    // this.toasterService.danger('', `This email has already taken!`)
  }

  back(data?) {
    if (this.isDialog) {
      this.componentRef.close(data)
      return
    } else {
      this._location.back()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
