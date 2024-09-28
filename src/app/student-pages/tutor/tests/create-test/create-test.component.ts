import {Component, OnInit, OnDestroy} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {Router} from '@angular/router'
import {Observable, Subject, firstValueFrom} from 'rxjs'
import {NbDialogService} from '@nebular/theme'
import {takeUntil} from 'rxjs/operators'
import {NbToastrService} from '@nebular/theme'
import {Exam} from '../../../../pages/exams/exams.interface'
import {CategoriesApi} from '../../../../services/apis/categories.service'
import {TutuorService} from '../../../../services/apis/tutuor.service'
import {QuestionModeEnum} from '../../tutor.interface'
import {prepareQuestionsForTest} from './helper-methods'
import {LoaderService} from '../../../../services/loader.service'
import {TakeTestComponent} from '../take-test/take-test.component'
@Component({
  selector: 'ngx-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['create-test.component.scss']
})
export class CreateTestComponent implements OnInit, OnDestroy {
  protected readonly unsubscribe$ = new Subject<void>()
  categories = []
  allCategorySubCategory = false

  questionType = {
    traditional: {label: 'Traditional', selected: false, count: 0},
    nextGeneration: {label: 'Next Gen', selected: false, count: 0}
  }

  questionModes = {
    unused: {label: 'Unused', selected: false, count: 0},
    incorrect: {label: 'Incorrect', selected: false, count: 0},
    marked: {label: 'Marked', selected: false, count: 0},
    omitted: {label: 'Omitted', selected: false, count: 0},
    correct: {label: 'Correct', selected: false, count: 0}
  }

  totalMarks = 0
  allQuestions = []

  filteredTraditionalQuestions = []
  filteredNextGenerationQuestions = []

  allQuestionsCount = 0
  noOfQuestions = 1
  maximumAllowedQuestions = 0

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private toasterService: NbToastrService,
    private categoriesService: CategoriesApi,
    private dialogService: NbDialogService,
    private tutuorService: TutuorService,
    private router: Router
  ) {}

  async ngOnInit() {
    await Promise.all([this.getCategoires(), this.availablePracticeQuestion()])

    this.allQuestionsCount = this.allQuestions.length
    this.calculateCountForQuestionType()
    this.calculateQuestionCountsForQuestionModes()
    this.calculateCountForCategories()
  }

  private async getCategoires() {
    this.categories = await firstValueFrom(this.categoriesService.getCategories())
    this.categories = this.categories.map(category => {
      category.subCategories = category.subCategories.map(subCategory => {
        subCategory.selected = false
        return subCategory
      })
      category.selected = false
      return category
    })
  }

  private async availablePracticeQuestion() {
    this.allQuestions = await firstValueFrom(this.tutuorService.availablePracticeQuestions())
  }

  private calculateCountForQuestionType() {
    this.filteredTraditionalQuestions = this.allQuestions.filter(i => !i.caseStudy)
    this.filteredNextGenerationQuestions = this.allQuestions.filter(i => i.caseStudy)

    this.questionType.traditional.count = this.filteredTraditionalQuestions.length
    this.questionType.nextGeneration.count = this.filteredNextGenerationQuestions.length
  }

  private calculateCountForCategories() {
    let filteredQuestions = []

    let questions = []

    if (!this.questionType.traditional.selected && this.questionType.nextGeneration.selected) {
      questions = this.filteredNextGenerationQuestions
    } else if (this.questionType.traditional.selected && !this.questionType.nextGeneration.selected) {
      questions = this.filteredTraditionalQuestions
    } else if (this.questionType.traditional.selected && this.questionType.nextGeneration.selected) {
      questions = this.allQuestions
    }

    // Append unused questions
    if (this.questionModes.unused.selected) {
      filteredQuestions = [...filteredQuestions, ...questions.filter(i => i.status === QuestionModeEnum.unused)]
    }

    // Append correct questions
    if (this.questionModes.correct.selected) {
      filteredQuestions = [...filteredQuestions, ...questions.filter(i => i.status === QuestionModeEnum.correct)]
    }

    // Append incorrect questions
    if (this.questionModes.incorrect.selected) {
      filteredQuestions = [...filteredQuestions, ...questions.filter(i => i.status === QuestionModeEnum.incorrect)]
    }

    // Append marked questions
    if (this.questionModes.marked.selected) {
      filteredQuestions = [...filteredQuestions, ...questions.filter(i => i.status === QuestionModeEnum.marked)]
    }

    // Append omitted questions
    if (this.questionModes.omitted.selected) {
      filteredQuestions = [...filteredQuestions, ...questions.filter(i => i.status === QuestionModeEnum.omitted)]
    }

    this.categories = this.categories.map(category => {
      category.count = filteredQuestions.filter(i => i.category === category.id).length
      if (category.count === 0) {
        category.selected = false
        this.allCategorySubCategory = false
      }

      category.subCategories.forEach(subcategory => {
        subcategory.count = filteredQuestions.filter(i => i.subCategory === subcategory.id).length

        if (subcategory.count === 0) {
          subcategory.selected = false
        }
      })
      return category
    })
  }

  private calculateQuestionCountsForQuestionModes() {
    let questions = this.allQuestions

    if (!this.questionType.traditional.selected && this.questionType.nextGeneration.selected) {
      questions = this.filteredNextGenerationQuestions
    } else if (this.questionType.traditional.selected && !this.questionType.nextGeneration.selected) {
      questions = this.filteredTraditionalQuestions
    }

    this.questionModes.unused.count = questions.filter(i => i.status === QuestionModeEnum.unused).length
    this.questionModes.incorrect.count = questions.filter(i => i.status === QuestionModeEnum.incorrect).length
    this.questionModes.marked.count = questions.filter(i => i.status === QuestionModeEnum.marked).length
    this.questionModes.omitted.count = questions.filter(i => i.status === QuestionModeEnum.omitted).length
    this.questionModes.correct.count = questions.filter(i => i.status === QuestionModeEnum.correct).length
  }

  private calculateMaximumAllowedQuestions() {
    const totalSelectedQuestionsCount = this.categories.reduce((total, category) => {
      // Add the count of selected subcategories
      const subCategoryTotal = category.subCategories.reduce((subTotal, subCategory) => {
        return subCategory.selected ? subTotal + subCategory.count : subTotal
      }, 0)

      // Add subcategory total to category total
      return total + subCategoryTotal
    }, 0)

    if (totalSelectedQuestionsCount > 50) this.maximumAllowedQuestions = 50
    else this.maximumAllowedQuestions = totalSelectedQuestionsCount
  }

  recalculateQuestionsCount() {
    this.calculateQuestionCountsForQuestionModes()
    this.calculateCountForCategories()
    this.calculateMaximumAllowedQuestions()
  }

  handleSubjectsSelection(event, type, categoryIndex = 0) {
    if (type === 'all') {
      this.allCategorySubCategory = true

      this.categories.forEach((item, index) => {
        if (item.count) {
          this.categories[index].selected = event
          item.subCategories.forEach((item_, subIndex) => {
            if (item_.count) {
              this.categories[index].subCategories[subIndex].selected = event
            }
          })
        }
      })
    } else if (type === 'category') {
      this.categories[categoryIndex].subCategories.forEach((item_, subIndex) => {
        if (item_.count) {
          this.categories[categoryIndex].subCategories[subIndex].selected = event
        }
      })
    } else if (type === 'subCategory') {
      const selected = this.categories[categoryIndex].subCategories.filter(i => i.selected)
      if (event) {
        this.categories[categoryIndex].selected = event
      } else if (!event && selected && selected.length === 1) {
        this.categories[categoryIndex].selected = false
      }
    }

    this.calculateMaximumAllowedQuestions()
  }

  save() {
    if (this.noOfQuestions > this.maximumAllowedQuestions) {
      this.toasterService.danger('', `You can only select ${this.maximumAllowedQuestions} questions`)
      return
    }

    if (this.noOfQuestions < 1) {
      this.toasterService.danger('', `Please select at least one question`)
      return
    }

    this.loaderService.isLoadingOverload.next({isLoading: true, message: 'Generating test...'})

    const sendData = {
      questionTypes: {
        traditional: this.questionType.traditional.selected,
        nextGeneration: this.questionType.nextGeneration.selected
      },
      questionModes: {
        unused: this.questionModes.unused.selected,
        correct: this.questionModes.correct.selected,
        incorrect: this.questionModes.incorrect.selected,
        marked: this.questionModes.marked.selected,
        omitted: this.questionModes.omitted.selected
      },
      categories: [],
      subcategories: [],
      noOfQuestions: this.noOfQuestions,
      questionsIds: []
    }

    this.categories.forEach(category => {
      if (category.selected) {
        sendData.categories.push(category.id)

        category.subCategories.forEach(subCategory => {
          if (subCategory.selected) {
            sendData.subcategories.push(subCategory.id)
          }
        })
      }
    })

    sendData.questionsIds = prepareQuestionsForTest(sendData, this.allQuestions)

    let observable = new Observable<Exam>()
    observable = this.tutuorService.createPracticeTest(sendData)
    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.toasterService.success('', 'Loading the test')
        this.loaderService.isLoadingOverload.next({isLoading: false, message: ''})
        this.startTest(res.id)
      },
      err => {
        this.loaderService.isLoadingOverload.next({isLoading: false, message: ''})
        this.toasterService.danger('', `Something went wrong!`)
      }
    )
  }

  private startTest(testId: string) {
    this.dialogService
      .open(TakeTestComponent, {
        context: {
          testId: testId
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(data => {
        this.routeTo(`student-pages/tutor/tests/list`)
      })
  }

  private routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
