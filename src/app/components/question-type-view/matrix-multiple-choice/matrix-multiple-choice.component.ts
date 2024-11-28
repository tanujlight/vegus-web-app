import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-matrix-multiple-choice',
  templateUrl: './matrix-multiple-choice.component.html'
})
export class MatrixMultipleChoiceComponent implements OnInit, AfterViewInit {
  @Input() question: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Input() user: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false

  actionColumnWidth = 'col-4'
  questionColumnWidth = 'col-4'

  constructor(private toasterService: NbToastrService, private cdref: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.viewMode === 'report') {
      this.setCorrectAnswer()
      this.setUserSelectedAnswer()
    } else {
      this.resetCorrectAnswer()
    }
  }

  ngAfterViewInit(): void {
    this.calculateQuestionsColumnWidth()
  }

  calculateQuestionsColumnWidth() {
    const columnsCount = this.question.columnsCount

    if (columnsCount === 3) {
      this.actionColumnWidth = 'col-3'
      this.questionColumnWidth = 'col-3'
    } else {
      this.actionColumnWidth = 'col-4'
      this.questionColumnWidth = 'col-4'
    }
    this.cdref.detectChanges()
  }

  setUserSelectedAnswer() {
    this.question.optionsArray.map((item, index) => {
      item.userSelectedAnswer = this.question.userSelectedAnswer[index]
    })
  }

  setCorrectAnswer() {
    this.question.optionsArray.map((item, index) => {
      item.options.map((optionItem, optionIndex) => {
        if (optionItem.isCorrect) {
          this.question.optionsArray[index].correctOption = optionIndex
        }
      })
    })
  }

  resetCorrectAnswer() {
    this.question.optionsArray.map((item, index) => {
      this.question.optionsArray[index].correctOption = null
    })
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
    if (this.showAnswer) {
      this.setCorrectAnswer()
    } else {
      this.resetCorrectAnswer()
    }
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    let marks = 0
    this.question.optionsArray.map(item => {
      item.options.map((optionItem, optionIndex) => {
        if (optionItem.isCorrect && optionIndex === item.userSelectedAnswer) {
          marks += 1
        }
      })
    })
    return marks
  }

  // Get all selected option with row index which is chossed by user
  getSelectedOptionByUser() {
    const answers = {}
    this.question.optionsArray.map((item, index) => {
      answers[index] = item.userSelectedAnswer
    })
    return answers
  }

  submit() {
    if (this.user.role.toLowerCase() !== 'admin' && this.viewMode !== 'report') {
      if (!this.validateCorrectOptions()) {
        return
      }
      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }

  private validateCorrectOptions(): boolean {
    const hasSelectedOption = this.question.optionsArray.every(
      item => item.userSelectedAnswer || item.userSelectedAnswer === 0
    )

    if (!hasSelectedOption) {
      this.toasterService.danger('', 'Select one option from each row')
      return false
    }

    return true
  }
}
