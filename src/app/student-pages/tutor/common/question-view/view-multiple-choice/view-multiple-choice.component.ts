import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {MultipleChoiceQuestion} from 'app/pages/questions/questions.interface'

@Component({
  selector: 'ngx-view-multiple-choice',
  templateUrl: './view-multiple-choice.component.html'
})
export class ViewMultipleChoiceComponent implements OnInit {
  @Input() question: MultipleChoiceQuestion
  @Output() submitAnswer = new EventEmitter<any>()
  correctOption = null
  showAnswer = false

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    if (
      this.question &&
      (this.question.isAttempted || this.question.status === 'incorrect' || this.question.status === 'correct')
    ) {
      this.setCorrectAnswer()
    } else {
      this.resetCorrectAnswer()
    }
  }

  setCorrectAnswer() {
    this.question.optionsArray.map((item, index) => {
      if (item.isCorrect) {
        this.correctOption = index
      }
    })
  }

  resetCorrectAnswer() {
    this.correctOption = null
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
    this.question.optionsArray.map((item, index) => {
      if (item.isCorrect) {
        this.correctOption = index
      }
    })
    if (this.correctOption === this.question.userSelectedAnswer) {
      return 1
    }
    return 0
  }

  submit() {
    if (!this.question.userSelectedAnswer && this.question.userSelectedAnswer !== 0) {
      this.toasterService.danger('', `Select correct option`)
      return
    }
    this.question.isAttempted = true
    this.question.marksObtained = this.calculateMarks()

    this.submitAnswer.emit()
  }
}
