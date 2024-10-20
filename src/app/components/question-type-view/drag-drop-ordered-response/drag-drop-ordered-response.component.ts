import {Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop'

@Component({
  selector: 'ngx-view-drag-drop-ordered-response',
  templateUrl: './drag-drop-ordered-response.component.html',
  styleUrls: ['./drag-drop-ordered-response.component.scss']
})
export class DragDropOrderedResponseComponent implements OnInit {
  @Input() question: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Input() user: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  optionsArray: string[] = []
  correctAnswer: string[] = []
  userSelectedAnswer: string[] = []
  isUserSelectedAnswerCorrect = false
  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.optionsArray = this.question.optionsArray.map(item => item.value)

    if (this.viewMode === 'report') {
      this.setCorrectAnswer()
      this.userSelectedAnswer = this.question.userSelectedAnswer
      this.isUserSelectedAnswerCorrect = this.checkUserAnswerIsCorrectOrNot()
    } else {
      this.resetCorrectAnswer()
      this.userSelectedAnswer = []
      this.isUserSelectedAnswerCorrect = false
    }
  }

  setCorrectAnswer() {
    const questionOptionsSequence = this.question.optionsArray.slice()

    this.correctAnswer = questionOptionsSequence
      .sort((a, b) => {
        if (a.sequence < b.sequence) {
          return -1
        }
      })
      .map(item => item.value)
  }

  resetCorrectAnswer() {
    this.correctAnswer = []
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
    if (this.showAnswer) {
      this.setCorrectAnswer()
      this.isUserSelectedAnswerCorrect = this.checkUserAnswerIsCorrectOrNot()
    } else {
      this.resetCorrectAnswer()
      this.isUserSelectedAnswerCorrect = false
    }
  }

  checkUserAnswerIsCorrectOrNot() {
    return JSON.stringify(this.correctAnswer) === JSON.stringify(this.userSelectedAnswer)
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    this.setCorrectAnswer()

    if (this.checkUserAnswerIsCorrectOrNot()) {
      return 1
    }
    return 0
  }

  submit() {
    if (this.user.role !== 'Admin') {
      if (
        this.viewMode === 'exam' &&
        (!this.userSelectedAnswer || this.userSelectedAnswer.length < this.question.optionsCount)
      ) {
        this.toasterService.danger('', `Please arrange all the options before submitting.`)
        return
      }
      this.question.userSelectedAnswer = this.userSelectedAnswer
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }

    this.submitAnswer.emit()
  }
}
