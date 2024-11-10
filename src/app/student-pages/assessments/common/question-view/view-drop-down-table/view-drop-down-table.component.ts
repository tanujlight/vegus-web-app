import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-drop-down-table',
  templateUrl: './view-drop-down-table.component.html'
})
export class ViewDropDownTableComponent implements OnInit {
  @Input() question: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    if (this.question && (this.question.isAttempted || this.question.status === 'incorrect' || this.question.status === 'correct')) {
      this.setCorrectAnswer()
    }
  }

  setCorrectAnswer() {
    this.question.optionsArray.map((item, index) => {
      item.userSelectedAnswer = this.question.userSelectedAnswer[index]
    })
  }

  private validateCorrectOptions(): boolean {
    const emptyData_ = this.question.optionsArray.filter(item => !item.userSelectedAnswer)
    if (emptyData_ && emptyData_.length) {
      this.toasterService.danger('', `Select correct option for each rows`)
      return false
    }
    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  private calculateMarks(): number {
    let marks = 0
    this.question.optionsArray.map(item => {
      if (item.userSelectedAnswer && item.correct === item.userSelectedAnswer) {
        marks += 1
      }
    })
    return marks
  }

  // Get all selected option with row index which is chossed by user
  private getSelectedOptionByUser() {
    const answers = {}
    this.question.optionsArray.map((item, index) => {
      answers[index] = item.userSelectedAnswer
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
