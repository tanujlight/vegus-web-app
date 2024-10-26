import {Component, OnDestroy, AfterViewInit} from '@angular/core'
import {NbDialogRef, NbToastrService, NbDialogService} from '@nebular/theme'
import {QuestionAndCaseStudy} from '../../exams.interface'
import {CategoriesApi} from 'app/services/apis/categories.service'
import {Category} from '../../../categories/categories.interface'
import {Subject} from 'rxjs'
import {QuestionsApi} from 'app/services/apis/questions.service'
import {CaseStudiesApi} from '../../../../services/apis/case-studies.service'
import ObjectId from 'bson-objectid'
import {CaseStudyViewComponent} from 'app/admin-pages/case-studies/case-study-view/case-study-view.component'

@Component({
  selector: 'ngx-add-question-and-case-study',
  templateUrl: './add-question-and-case-study.component.html',
  styleUrls: ['./add-question-and-case-study.component.scss'],
  providers: [CategoriesApi, QuestionsApi, CaseStudiesApi]
})
export class AddQuestionAndCaseStudyComponent implements AfterViewInit, OnDestroy {
  alreadyAddedQuestions: QuestionAndCaseStudy[] = []
  alreadyAddedCaseStudies: QuestionAndCaseStudy[] = []
  type: 'question' | 'caseStudy'
  categories = []
  subCategories = []
  selectedCategory = null
  selectedSubCategory = null

  selectedQuestionsOrCaseStudies: QuestionAndCaseStudy[] = []

  questionsList = []
  caseStudiesList = []

  protected readonly unsubscribe$ = new Subject<void>()

  constructor(
    private categoriesService: CategoriesApi,
    private questionsService: QuestionsApi,
    private caseStudiesService: CaseStudiesApi,
    private toasterService: NbToastrService,
    protected dialogRef: NbDialogRef<AddQuestionAndCaseStudyComponent>,
    private dialogService: NbDialogService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Call your API inside the setTimeout
      this.getCategoires()
    })
  }

  private getCategoires() {
    this.categoriesService.getCategories().subscribe((categoires: Category[]) => {
      this.categories = categoires
    })
  }

  categoryChange(event) {
    const categoryId = event.target.value
    if (categoryId) {
      this.subCategories = []
      const selectedCategory = this.categories.find(category => category.id === categoryId)
      if (selectedCategory) {
        this.subCategories = selectedCategory.subCategories
      }
    }
  }

  subCategoryChange(event) {
    const subCategoryId = event.target.value
    if (subCategoryId) {
      if (this.type === 'question') {
        this.getQuestions()
      } else {
        this.getCaseStudies()
      }
    }
  }

  selectQuestion(event, question) {
    if (event === true) {
      const newItemId = new ObjectId().toHexString()
      this.selectedQuestionsOrCaseStudies.push({
        _id: newItemId,
        id: newItemId,
        type: 'question',
        question
      })
    } else if (event === false) {
      this.selectedQuestionsOrCaseStudies = this.selectedQuestionsOrCaseStudies.filter(
        item => item.question.id !== question.id
      )
    }
  }

  selectCaseStudy(event, caseStudy) {
    if (event === true) {
      const newItemId = new ObjectId().toHexString()
      this.selectedQuestionsOrCaseStudies.push({
        _id: newItemId,
        id: newItemId,
        type: 'caseStudy',
        caseStudy
      })
    } else if (event === false) {
      this.selectedQuestionsOrCaseStudies = this.selectedQuestionsOrCaseStudies.filter(
        item => item.caseStudy.id !== caseStudy.id
      )
    }
  }
  nextItem() {
    console.warn('next item clicked')
  }
  removeSelectedQuestionAndCaseStudy(item) {
    this.selectedQuestionsOrCaseStudies = this.selectedQuestionsOrCaseStudies.filter(i => i.id !== item.id)
    this.refetchQuestionsAndCaseStudies()
  }

  openViewCaseStudyDialog(caseStudy) {
    this.dialogService.open(CaseStudyViewComponent, {
      context: {
        caseStudyId: caseStudy.id
      }
    })
  }

  private removeAlreadyAddedQuestionsAndCaseStudies() {
    this.questionsList = this.questionsList
      .filter(question => !this.alreadyAddedQuestions.some(item => item.question.id === question.id))
      .map(question => {
        return {
          ...question,
          selected: !!this.selectedQuestionsOrCaseStudies.find(item => item.question.id === question.id)
        }
      })
    this.caseStudiesList = this.caseStudiesList
      .filter(caseStudy => !this.alreadyAddedCaseStudies.some(item => item.caseStudy.id === caseStudy.id))
      .map(caseStudy => {
        return {
          ...caseStudy,
          selected: !!this.selectedQuestionsOrCaseStudies.find(item => item.caseStudy.id === caseStudy.id)
        }
      })
  }

  private refetchQuestionsAndCaseStudies() {
    if (this.type === 'question') this.getQuestions()
    else if (this.type === 'caseStudy') this.getCaseStudies()
  }

  private getQuestions() {
    this.questionsList = []
    const query = {
      category: this.selectedCategory,
      subCategory: this.selectedSubCategory,
      pageSize: 500,
      pageNumber: 1,
      examUsage: 'exam'
    }
    this.questionsService.list(query).subscribe(
      (questions: any) => {
        this.questionsList = questions.items
        this.removeAlreadyAddedQuestionsAndCaseStudies()
      },
      error => {
        this.toasterService.danger(error.message)
      }
    )
  }

  private getCaseStudies() {
    this.caseStudiesList = []
    const query = {
      category: this.selectedCategory,
      subCategory: this.selectedSubCategory,
      pageSize: 500,
      pageNumber: 1,
      examUsage: 'exam'
    }
    this.caseStudiesService.list(query).subscribe(
      (caseStudies: any) => {
        this.caseStudiesList = caseStudies.items
        this.removeAlreadyAddedQuestionsAndCaseStudies()
      },
      error => {
        this.toasterService.danger(error.message)
      }
    )
  }

  back() {
    this.dialogRef.close()
  }

  save() {
    if (!this.type) {
      this.toasterService.warning('Please select type', 'Warning')
      return
    }

    if (!this.selectedCategory || !this.selectedSubCategory) {
      this.toasterService.warning('Please select category & sub category', 'Warning')
      return
    }

    if (!this.selectedQuestionsOrCaseStudies || this.selectedQuestionsOrCaseStudies.length === 0) {
      this.toasterService.warning('Please select question or case study', 'Warning')
      return
    }

    this.dialogRef.close(this.selectedQuestionsOrCaseStudies)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
