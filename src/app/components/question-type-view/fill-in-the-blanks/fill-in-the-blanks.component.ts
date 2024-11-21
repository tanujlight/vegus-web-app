import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-fill-in-the-blanks',
  templateUrl: './fill-in-the-blanks.component.html'
})
export class FillInTheBlanksComponent implements OnInit {
  @Input() question: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Input() user: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  userSelectedAnswer

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    if (this.viewMode === 'report') {
      this.setCorrectAnswer()
    }
  }

  setCorrectAnswer() {
    this.userSelectedAnswer = this.question.userSelectedAnswer
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    if (this.question.fillInTheBlankAnswer === this.userSelectedAnswer) {
      return 1
    }
    return 0
  }

  submit() {
    if (this.user.role.toLowerCase() !== 'admin' && this.viewMode !== 'report') {
      if (this.user.role.toLowerCase() !== 'admin' && !this.userSelectedAnswer) {
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
