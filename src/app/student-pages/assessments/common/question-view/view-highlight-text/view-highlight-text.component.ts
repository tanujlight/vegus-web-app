import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {HIGHLIGHT_FILLUP_PATTERN} from '../../constants'

@Component({
  selector: 'ngx-view-highlight-text',
  templateUrl: './view-highlight-text.component.html',
  styleUrls: ['./view-highlight-text.component.scss']
})
export class ViewHighlightTextComponent implements OnInit {
  @Input() question: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  content: any[] = []

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.prepareDropDownClozeView()
  }

  private prepareDropDownClozeView() {
    const parts = this.question.content.split(HIGHLIGHT_FILLUP_PATTERN)
    const result = []
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Even indices represent normal text
        result.push({type: 'text', value: parts[i]})
      } else {
        let answer
        let userAnswer
        this.question.allOptions.map((item_, index) => {
          if (item_.value === parts[i]) {
            answer = item_
            if (
              this.question && this.question.isAttempted &&
              this.question.userSelectedAnswer.indexOf(index) > -1
            ) {
              userAnswer = item_
            }
          }
        })
        // Odd indices represent fill-up text
        result.push({
          type: 'fillup',
          value: parts[i],
          userSelectedAnswer: this.question && this.question.isAttempted && userAnswer ? true : false,
          correct: answer.correct
        })
        answer = null
        userAnswer = null
      }
    }
    this.content = result
  }

  fillupClicked(item, contentIndex) {
    this.content[contentIndex].userSelectedAnswer = !this.content[contentIndex].userSelectedAnswer
    const allOptionLength = this.question.allOptions.length
    for (let i = 0; i < allOptionLength; i++) {
      if (this.question.allOptions[i].value === item) {
        this.question.allOptions[i].userSelectedAnswer = !this.question.allOptions[i].userSelectedAnswer
      }
    }
  }

  private validateCorrectOptions(): boolean {
    const emptyData_ = this.question.allOptions.filter(item => item.userSelectedAnswer)
    if (!emptyData_ || !emptyData_.length) {
      this.toasterService.danger('', `Please select at least one option.`)
      return false
    }
    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    let marks = 0
    this.question.allOptions.map(item => {
      if (item.userSelectedAnswer) {
        if (item.correct === item.userSelectedAnswer) {
          marks += 1
        } else {
          marks -= 1
        }
      }
    })
    if (marks < 0) marks = 0
    return marks
  }

  // Get all selected option index which is chossed by user
  getSelectedOptionByUser() {
    const answers = []
    this.question.allOptions.map((item, index) => {
      if (item.userSelectedAnswer) answers.push(index)
    })
    return answers
  }

  submit() {
    if (!this.question || !this.question.isAttempted) {
      if (!this.validateCorrectOptions()) return
      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
