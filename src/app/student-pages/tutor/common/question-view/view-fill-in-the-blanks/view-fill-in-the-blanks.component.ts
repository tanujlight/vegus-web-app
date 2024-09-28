import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-fill-in-the-blanks',
  templateUrl: './view-fill-in-the-blanks.component.html'
})
export class ViewFillInTheBlanksComponent implements OnInit {
  @Input() question: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  userSelectedAnswer

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    if (this.question && (this.question.isAttempted || this.question.status === 'incorrect' || this.question.status === 'correct')) {
      this.setCorrectAnswer()
    }
  }

  setCorrectAnswer() {
    this.userSelectedAnswer = this.question.userSelectedAnswer
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    if (this.question.fillInTheBlankAnswer === this.userSelectedAnswer) {
      return 1
    }
    return 0
  }

  submit() {
    if (!this.question || !this.question.isAttempted) {
      if (!this.userSelectedAnswer) {
        this.toasterService.danger('', `Please fill the answer`)
        return
      }
      this.question.userSelectedAnswer = this.userSelectedAnswer
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
