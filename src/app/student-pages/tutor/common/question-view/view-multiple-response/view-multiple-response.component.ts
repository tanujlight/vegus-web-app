import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-multiple-response',
  templateUrl: './view-multiple-response.component.html',
  styleUrls: ['./view-multiple-response.component.scss']
})
export class ViewMultipleResponseComponent implements OnInit {
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
      if (this.question.userSelectedAnswer.indexOf(index) > -1) {
        this.question.optionsArray[index].userSelectedAnswer = true
      }
    })
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    let marks = 0
    this.question.optionsArray.map(item => {
      if (item.userSelectedAnswer) {
        if (item.isCorrect === item.userSelectedAnswer) {
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
    this.question.optionsArray.map((item, index) => {
      if (item.userSelectedAnswer) answers.push(index)
    })
    return answers
  }

  submit() {
    if (!this.question || !this.question.isAttempted) {
      const correctData = this.question.optionsArray.filter(item => item.userSelectedAnswer)
      if (!correctData || !correctData.length) {
        this.toasterService.danger('', `Select atleast one correct option`)
        return
      }
      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
