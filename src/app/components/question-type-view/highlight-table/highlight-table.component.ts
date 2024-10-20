import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {HIGHLIGHT_FILLUP_PATTERN} from '../constants'

@Component({
  selector: 'ngx-view-highlight-table',
  templateUrl: './highlight-table.component.html',
  styleUrls: ['./highlight-table.component.scss']
})
export class HighlightTableComponent implements OnInit {
  @Input() question: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Input() user: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.prepareDropDownClozeView()
  }

  private prepareDropDownClozeView() {
    const optionsArrayLength = this.question.optionsArray.length
    for (let j = 0; j < optionsArrayLength; j++) {
      const parts = this.question.optionsArray[j].content.split(HIGHLIGHT_FILLUP_PATTERN)
      const result = []
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // Even indices represent normal text
          result.push({type: 'text', value: parts[i]})
        } else {
          let answer
          let userAnswer
          this.question.optionsArray[j].allOptions.map((item_, index) => {
            if (item_.value === parts[i]) {
              answer = item_
              if (
                this.userType === 'student' &&
                this.viewMode === 'report' &&
                this.question.userSelectedAnswer[j].indexOf(index) > -1
              ) {
                userAnswer = item_
              }
            }
          })
          // Odd indices represent fill-up text
          result.push({
            type: 'fillup',
            value: parts[i],
            userSelectedAnswer: this.userType === 'student' && this.viewMode === 'report' && userAnswer ? true : false,
            correct: answer.correct
          })
          answer = null
          userAnswer = null
        }
      }
      this.question.optionsArray[j].contentArray = result
    }
  }

  fillupClicked(optionArrayIndex, item, contentIndex) {
    this.question.optionsArray[optionArrayIndex].contentArray[contentIndex].userSelectedAnswer =
      !this.question.optionsArray[optionArrayIndex].contentArray[contentIndex].userSelectedAnswer
    const allOptionLength = this.question.optionsArray[optionArrayIndex].allOptions.length
    for (let i = 0; i < allOptionLength; i++) {
      if (this.question.optionsArray[optionArrayIndex].allOptions[i].value === item) {
        this.question.optionsArray[optionArrayIndex].allOptions[i].userSelectedAnswer =
          !this.question.optionsArray[optionArrayIndex].allOptions[i].userSelectedAnswer
      }
    }
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
  }

  private validateCorrectOptions(): boolean {
    const hasSelectedOption = this.question.optionsArray.some(question =>
      question.allOptions.some(option => option.userSelectedAnswer)
    )

    if (!hasSelectedOption) {
      this.toasterService.danger('', 'Select at least one option')
      return false
    }

    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    let marks = 0
    const optionsArrayLength = this.question.optionsArray.length
    for (let j = 0; j < optionsArrayLength; j++) {
      this.question.optionsArray[j].allOptions.map(item => {
        if (item.userSelectedAnswer) {
          if (item.correct === item.userSelectedAnswer) {
            marks += 1
          } else {
            marks -= 1
          }
        }
      })
    }
    if (marks < 0) marks = 0
    return marks
  }

  // Get all selected option index which is chossed by user
  getSelectedOptionByUser() {
    const answers = {}
    const optionsArrayLength = this.question.optionsArray.length
    for (let j = 0; j < optionsArrayLength; j++) {
      answers[j] = []
      this.question.optionsArray[j].allOptions.map((item, index) => {
        if (item.userSelectedAnswer) answers[j].push(index)
      })
    }
    return answers
  }

  submit() {
    if (this.user.role !== 'Admin' && this.viewMode !== 'report') {
      if (!this.validateCorrectOptions()) return
      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
