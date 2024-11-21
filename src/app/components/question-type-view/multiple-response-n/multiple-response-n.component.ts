import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-multiple-response-n',
  templateUrl: './multiple-response-n.component.html',
  styleUrls: ['./multiple-response-n.component.scss']
})
export class MultipleResponseNComponent implements OnInit {
  @Input() question: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Output() submitAnswer = new EventEmitter<any>()
  @Input() user: any
  showAnswer = false

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    if (this.viewMode === 'report') {
      this.setCorrectAnswer()
    }
  }

  setCorrectAnswer() {
    this.question.optionsArray.map((item, index) => {
      if (this.question.userSelectedAnswer.indexOf(index) > -1) {
        this.question.optionsArray[index].userSelectedAnswer = true
      }
    })
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    let marks = 0
    this.question.optionsArray.map(item => {
      if (item.userSelectedAnswer && item.isCorrect === item.userSelectedAnswer) {
        marks += 1
      }
    })
    return marks
  }

  // Get all selected option index which is chossed by user
  getSelectedOptionByUser() {
    const answers = []
    this.question.optionsArray.map((item, index) => {
      if (item.userSelectedAnswer) answers.push(index)
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
    const correctData = this.question.optionsArray.filter(item => item.userSelectedAnswer)
    if (!correctData || correctData.length !== this.question.selectedOptions) {
      this.toasterService.danger('', `Select ${this.question.selectedOptions} correct option`)
      return false
    }

    return true
  }
}
