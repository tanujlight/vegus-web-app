import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-graphic-in-answer',
  templateUrl: './graphic-in-answer.component.html',
  styleUrls: ['./graphic-in-answer.component.scss']
})
export class GraphicInAnswerComponent implements OnInit {
  @Input() question: any
  @Input() user: any

  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Output() submitAnswer = new EventEmitter<any>()
  correctOption = null
  showAnswer = false

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    if (this.viewMode === 'report') {
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
    if (this.user.role !== 'Admin') {
      if (this.viewMode === 'exam' && !this.question.userSelectedAnswer && this.question.userSelectedAnswer !== 0) {
        this.toasterService.danger('', `Select correct option`)
        return
      }

      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }

    this.submitAnswer.emit()
  }
}
