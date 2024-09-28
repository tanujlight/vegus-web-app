import {Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop'

@Component({
  selector: 'ngx-view-drag-drop-ordered-response',
  templateUrl: './view-drag-drop-ordered-response.component.html',
  styleUrls: ['./view-drag-drop-ordered-response.component.scss']
})
export class ViewDragDropOrderedResponseComponent implements OnInit {
  @Input() question: any
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

    if (this.question && (this.question.isAttempted || this.question.status === 'incorrect' || this.question.status === 'correct')) {
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
    if (!this.question.isAttempted &&
      (!this.userSelectedAnswer || this.userSelectedAnswer.length < this.question.optionsCount)
    ) {
      this.toasterService.danger('', `Please arrange all the options before submitting.`)
      return
    }
    this.question.userSelectedAnswer = this.userSelectedAnswer
    this.question.isAttempted = true
    this.question.marksObtained = this.calculateMarks()

    this.submitAnswer.emit()
  }
}
