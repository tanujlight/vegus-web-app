import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {NbDialogRef, NbStepperComponent} from '@nebular/theme'
import {NbDialogService} from '@nebular/theme'
import {ConfirmDialogComponent} from 'app/components/confirmation-dialog/confirmation-dialog.component'
import {TutuorService} from 'app/services/apis/tutuor.service'
import {Subject, Subscription, interval, firstValueFrom} from 'rxjs'
import {NavigatorComponent} from '../../common/navigator/navigator.component'
import {PracticeTestStatusEnum, QuestionStatusEnum} from '../../tutor.interface'
import {NbIconLibraries} from '@nebular/theme'
import {LoaderService} from 'app/services/loader.service'
import {INavigatorQuestion} from '../../common/navigator/navigator.interface'

@Component({
  selector: 'ngx-take-test',
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.scss']
})
export class TakeTestComponent implements OnInit, OnDestroy {
  @ViewChild('examStepper') examStepper: NbStepperComponent
  @Input() testId: string
  nextClicked: Subject<any> = new Subject<void>()
  prevClicked: Subject<any> = new Subject<void>()

  gotToSpecificCaseStudyIndex: Subject<any> = new Subject<void>()

  test = {
    _id: '',
    noOfQuestions: 0,
    timeSpent: 0,
    questionsAndCaseStudies: [],
    uniqueIdentifier: '',
    lastActiveQuestion: null,
    status: ''
  }
  currIndex = 1
  selectedCasestudyQuestionsIndex = 0
  navigatorQuestions: INavigatorQuestion[] = []

  activeQuestion = null

  constructor(
    private loaderService: LoaderService,
    private tutuorService: TutuorService,
    protected dialogRef: NbDialogRef<TakeTestComponent>,
    private dialogService: NbDialogService,
    iconsLibrary: NbIconLibraries
  ) {
    iconsLibrary.registerFontPack('ion', {iconClassPrefix: 'ion'})
  }

  ngOnDestroy() {}

  async ngOnInit() {
    await this.loadTest(this.testId)

    setTimeout(() => {
      this.setActiveQuestion()
      this.calculateQuestionIndex()

      this.updateExamStatusAsResumed()
    }, 1000)
  }

  private setActiveQuestion() {
    // If the last active question is set, navigate to it
    if (this.test.lastActiveQuestion) {
      this.goToSelectedQuestion({
        uniqueIdentifier: this.test.lastActiveQuestion.uniqueIdentifier,
        status: '',
        questionId: this.test.lastActiveQuestion._id,
        caseStudyId: this.test.lastActiveQuestion.caseStudy
      })
    } else {
      // Otherwise, set the active question to the first question
      const selectedItem = this.test.questionsAndCaseStudies[this.examStepper.selectedIndex]

      if (selectedItem.question) {
        this.activeQuestion = selectedItem.question
      } else {
        this.activeQuestion = selectedItem.caseStudy.questions[this.selectedCasestudyQuestionsIndex]
      }
    }
  }

  private goToExamStepperIndex(index: number) {
    if (this.examStepper.selectedIndex > index) {
      for (let i = this.examStepper.selectedIndex; i > index; i--) {
        this.examStepper.previous()
      }
    } else {
      for (let i = this.examStepper.selectedIndex; i < index; i++) {
        this.examStepper.next()
      }
    }
  }

  private calculateQuestionIndex() {
    let totalIndex = 0

    for (const item of this.test.questionsAndCaseStudies) {
      if (item.type === 'caseStudy') {
        if (item.caseStudy._id === this.activeQuestion.caseStudy) {
          const questionIndex = item.caseStudy.questions.findIndex(question => question._id === this.activeQuestion._id)
          if (questionIndex !== -1) {
            this.currIndex = totalIndex + questionIndex + 1 // +1 for 1-based index
            return
          }
        }
        // Add the number of questions in this caseStudy to totalIndex
        totalIndex += item.caseStudy.questions.length
      } else if (item.type === 'question') {
        if (item.question._id === this.activeQuestion._id) {
          this.currIndex = totalIndex + 1 // +1 for 1-based index
          return
        }
        totalIndex++
      }
    }

    // Handle case where the question was not found
    console.error('Question not found:', this.activeQuestion._id)
  }

  private async loadTest(id) {
    const testData = await firstValueFrom(this.tutuorService.get(id))
    this.test = testData
    this.prepareNavigatorQuestions()
  }

  private prepareNavigatorQuestions() {
    const navigatorQuestions = []

    this.test.questionsAndCaseStudies.forEach(questionAndCaseStudy => {
      if (questionAndCaseStudy.type === 'caseStudy') {
        questionAndCaseStudy.caseStudy.questions.forEach(caseStudyQuestion => {
          navigatorQuestions.push({
            uniqueIdentifier: caseStudyQuestion.uniqueIdentifier,
            status: caseStudyQuestion.status,
            questionId: caseStudyQuestion._id,
            caseStudyId: questionAndCaseStudy.caseStudy._id
          })
        })
      } else if (questionAndCaseStudy.type === 'question') {
        navigatorQuestions.push({
          uniqueIdentifier: questionAndCaseStudy.question.uniqueIdentifier,
          status: questionAndCaseStudy.question.status,
          questionId: questionAndCaseStudy.question._id,
          caseStudyId: null
        })
      }
    })

    this.navigatorQuestions = navigatorQuestions
  }

  // handle submit answer for each standalone question and case study question
  async handleSubmitAnswer(event, examStepperIndex) {
    const currentActive = this.test.questionsAndCaseStudies[this.examStepper.selectedIndex]
    const isQuestionType = currentActive.type === 'question'

    const questionData = isQuestionType
      ? currentActive.question
      : currentActive.caseStudy.questions[event.questionIndex]

    const sendData = {
      question: {
        _id: questionData._id,
        marksObtained: questionData.marksObtained,
        status: questionData.status,
        timeTaken: 200, // Consider if this should be dynamically set
        userSelectedAnswer: questionData.userSelectedAnswer
      },
      questionAndCaseStudyId: currentActive._id,
      testTimeSpent: this.test.timeSpent
    }

    await this.apiCallToSubmitAnswer(sendData)
  }

  nextBtnClicked() {
    const parentIndex = this.examStepper.selectedIndex
    const currentItem = this.test.questionsAndCaseStudies[parentIndex]
    const totalItemsCount = this.test.questionsAndCaseStudies.length

    if (!currentItem) {
      console.error('Current item not found.')
      return
    }

    const isLastParentItem = parentIndex === totalItemsCount - 1
    let isLastQuestionInCaseStudy = false

    if (currentItem.type === 'caseStudy') {
      const caseStudyQuestions = currentItem.caseStudy.questions
      const currentQuestion = caseStudyQuestions[this.selectedCasestudyQuestionsIndex]
      const totalCaseStudyQuestions = caseStudyQuestions.length

      isLastQuestionInCaseStudy = this.selectedCasestudyQuestionsIndex === totalCaseStudyQuestions - 1

      this.markQuestionOmitted(currentQuestion, currentItem._id)

      if (isLastParentItem && isLastQuestionInCaseStudy) {
        this.onEndConfirm()
        return
      }

      if (!isLastQuestionInCaseStudy) {
        this.selectedCasestudyQuestionsIndex++
        this.activeQuestion = caseStudyQuestions[this.selectedCasestudyQuestionsIndex]
        this.nextClicked.next({caseStudyId: currentItem.caseStudy._id})
      } else {
        this.selectedCasestudyQuestionsIndex = 0
        this.examStepper.next()

        const targetParentStepperItem = this.test.questionsAndCaseStudies[parentIndex + 1]

        if (targetParentStepperItem.type === 'caseStudy') {
          this.activeQuestion = targetParentStepperItem.caseStudy.questions[0]
        } else {
          this.activeQuestion = targetParentStepperItem.question
        }
      }
    } else {
      const question = currentItem.question

      this.markQuestionOmitted(question, currentItem._id)

      if (isLastParentItem) {
        this.onEndConfirm()
        return
      }

      this.activeQuestion = this.test.questionsAndCaseStudies[parentIndex + 1].question
      this.examStepper.next()
    }

    this.calculateQuestionIndex()
  }

  prevBtnClicked() {
    const currentItemIndex = this.examStepper.selectedIndex
    const currentItem = this.test.questionsAndCaseStudies[currentItemIndex]

    if (!currentItem) {
      console.error('Current item not found.')
      return
    }

    if (currentItem.type === 'caseStudy' && this.selectedCasestudyQuestionsIndex > 0) {
      this.selectedCasestudyQuestionsIndex--
      this.activeQuestion = currentItem.caseStudy.questions[this.selectedCasestudyQuestionsIndex]
      this.prevClicked.next({caseStudyId: currentItem.caseStudy._id})
    } else {
      this.examStepper.previous()

      const previousItemIndex = this.examStepper.selectedIndex
      const previousItem = this.test.questionsAndCaseStudies[previousItemIndex]

      if (previousItem.type === 'caseStudy') {
        this.selectedCasestudyQuestionsIndex = previousItem.caseStudy.questions.length - 1
        this.activeQuestion = previousItem.caseStudy.questions[this.selectedCasestudyQuestionsIndex]
      } else {
        this.activeQuestion = previousItem.question
      }
    }

    this.calculateQuestionIndex()
  }

  onEndConfirm(event?): void {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: {
          title: 'Confirm',
          message: 'Are you sure you want to end this test?'
        }
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.endExam()
        } else {
          event?.confirm.reject()
        }
      })
  }

  onSuspendConfirm(event): void {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: {
          title: 'Confirm',
          message: 'Are you sure you want to suspend this test?'
        }
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.suspendExam()
        } else {
          event.confirm.reject()
        }
      })
  }

  openNavigatorDialog() {
    this.dialogService
      .open(NavigatorComponent, {
        context: {
          questions: this.navigatorQuestions
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(async (selectedQuestion: INavigatorQuestion) => {
        if (selectedQuestion) this.goToSelectedQuestion(selectedQuestion)
      })
  }

  private goToSelectedQuestion(selectedQuestion: INavigatorQuestion) {
    const examStepperTargetIndex = this.test.questionsAndCaseStudies.findIndex(item => {
      if (selectedQuestion.caseStudyId) {
        return item.type === 'caseStudy' && item.caseStudy._id === selectedQuestion.caseStudyId
      }

      return item.type === 'question' && item.question._id === selectedQuestion.questionId
    })

    if (examStepperTargetIndex === -1) {
      console.error('Question with ID not found:', selectedQuestion.questionId)
      return
    }

    const currentExamItem = this.test.questionsAndCaseStudies[this.examStepper.selectedIndex]
    const targetExamItem = this.test.questionsAndCaseStudies[examStepperTargetIndex]

    if (targetExamItem._id !== currentExamItem._id) {
      // Reset the selectedCasestudyQuestionsIndex if the case study is different
      this.selectedCasestudyQuestionsIndex = 0
    }

    this.goToExamStepperIndex(examStepperTargetIndex)

    if (targetExamItem.type === 'caseStudy') {
      const targetCaseStudyIndex = this.test.questionsAndCaseStudies[
        examStepperTargetIndex
      ].caseStudy.questions.findIndex(question => question._id === selectedQuestion.questionId)

      this.selectedCasestudyQuestionsIndex = targetCaseStudyIndex

      this.gotToSpecificCaseStudyIndex.next({
        caseStudyId: targetExamItem.caseStudy._id,
        index: targetCaseStudyIndex
      })

      this.activeQuestion = targetExamItem.caseStudy.questions[targetCaseStudyIndex]
    } else {
      this.selectedCasestudyQuestionsIndex = 0
      this.activeQuestion = targetExamItem.question
    }

    this.calculateQuestionIndex()
  }

  private async markQuestionOmitted(question, questionAndCaseStudyId: string) {
    if (question.status !== QuestionStatusEnum.unseen) return
    const sendData = {
      question: {
        _id: question._id,
        marksObtained: 0,
        status: 'omitted',
        timeTaken: 200, // Consider if this should be dynamically set
        userSelectedAnswer: null
      },
      questionAndCaseStudyId: questionAndCaseStudyId,
      testTimeSpent: this.test.timeSpent
    }

    await this.apiCallToSubmitAnswer(sendData)

    this.test.questionsAndCaseStudies = this.test.questionsAndCaseStudies.map(item => {
      if (item.type === 'question' && item.question._id === question._id) {
        item.question.status = 'omitted'
      } else if (item.type === 'caseStudy') {
        item.caseStudy.questions = item.caseStudy.questions.map(caseStudyQuesItem => {
          if (caseStudyQuesItem._id === question._id) {
            caseStudyQuesItem.status = 'omitted'
          }
          return caseStudyQuesItem
        })
      }
      return item
    })
  }

  async markAsReview() {
    let currentQuestion
    const parentIndex = this.examStepper.selectedIndex
    const currentItem = this.test.questionsAndCaseStudies[parentIndex]
    if (currentItem.type === 'caseStudy') {
      const caseStudyQuestions = currentItem.caseStudy.questions
      currentQuestion = caseStudyQuestions[this.selectedCasestudyQuestionsIndex]
    } else {
      currentQuestion = currentItem.question
    }
    const sendData = {
      questionId: currentQuestion ? currentQuestion._id : '',
      status: QuestionStatusEnum.marked
    }
    await firstValueFrom(this.tutuorService.updateQuestionState(this.test._id, sendData))
  }

  private async suspendExam() {
    const sendData = {
      status: PracticeTestStatusEnum.suspended,
      timeSpent: this.test.timeSpent,
      lastActiveQuestionId: this.activeQuestion._id
    }
    await this.updatePracticeTest(sendData)
    this.dialogRef.close('suspended')
  }

  private async updateExamStatusAsResumed() {
    if (this.test.status !== 'completed') {
      const sendData = {
        status: PracticeTestStatusEnum.resumed,
        timeSpent: this.test.timeSpent,
        lastActiveQuestionId: this.activeQuestion._id
      }

      this.loaderService.showLoader.next(false)
      await this.updatePracticeTest(sendData)
      this.setShowLoaderToTrue()
    }
  }

  private async endExam() {
    const hasStatus = this.test.questionsAndCaseStudies.some(item => {
      if (item.type === 'question') {
        return (
          item.question.status === QuestionStatusEnum.marked ||
          item.question.status === QuestionStatusEnum.omitted ||
          item.question.status === QuestionStatusEnum.unseen
        )
      } else if (item.type === 'caseStudy') {
        return item.caseStudy.questions.some(
          caseStudyQuesItem =>
            caseStudyQuesItem.status === QuestionStatusEnum.marked ||
            caseStudyQuesItem.status === QuestionStatusEnum.omitted ||
            caseStudyQuesItem.status === QuestionStatusEnum.unseen
        )
      }
      return false
    })
    const sendData = {
      status: hasStatus ? PracticeTestStatusEnum.resumed : PracticeTestStatusEnum.completed,
      timeSpent: this.test.timeSpent,
      lastActiveQuestionId: this.activeQuestion._id
    }
    await this.updatePracticeTest(sendData)
    this.dialogRef.close('completed')
  }

  private async updatePracticeTest(sendData) {
    await firstValueFrom(this.tutuorService.updatePracticeTest(this.test._id, sendData))
  }

  private async apiCallToSubmitAnswer(sendData) {
    this.loaderService.showLoader.next(false)
    await firstValueFrom(this.tutuorService.submitAnswer(this.test._id, sendData))
    this.setShowLoaderToTrue()
  }

  private setShowLoaderToTrue() {
    setTimeout(() => {
      this.loaderService.showLoader.next(true)
    }, 200)
  }
}
