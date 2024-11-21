import {CdkDragDrop, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop'
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {FILLUP_PATTERN} from '../constants'
import {DragDropTriadsQuestion} from '../../../admin-pages/questions/questions.interface'

@Component({
  selector: 'ngx-view-drag-drop-triads',
  templateUrl: './drag-drop-triads.component.html',
  styleUrls: ['./drag-drop-triads.component.scss']
})
export class DragDropTriadsViewComponent implements OnInit {
  @Input() question: DragDropTriadsQuestion
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Input() user: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  content: any[] = []

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.prepareDropDownClozeView()

    if (!this.question.userSelectedAnswer) {
      this.question.userSelectedAnswer = {
        cause: '',
        effect1: '',
        effect2: ''
      }
    }

    if (this.viewMode === 'report') {
      this.setCorrectAnswer()
    }
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
      if (event.container.data.length > 1) {
        transferArrayItem(event.container.data, event.previousContainer.data, 1, 0)
      }
    }
  }

  droptoList(event: CdkDragDrop<string[]>): void {
    if (!(event.previousContainer === event.container)) {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }

  setCorrectAnswer() {
    this.content.map(item => {
      if (item.type === 'fillup' && item.key === 'cause') {
        item.userSelectedAnswer[0] = this.question.userSelectedAnswer.cause
      }

      if (item.type === 'fillup' && item.key === 'effect1') {
        item.userSelectedAnswer[0] = this.question.userSelectedAnswer.effect1
      }

      if (item.type === 'fillup' && item.key === 'effect2') {
        item.userSelectedAnswer[0] = this.question.userSelectedAnswer.effect2
      }
    })
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
  }

  private prepareDropDownClozeView() {
    const wordsArray = this.question.content.split(FILLUP_PATTERN)

    wordsArray.map(word => {
      if (word.includes('[[Cause]]')) {
        const item = {
          type: 'fillup',
          key: 'cause',
          userSelectedAnswer: [],
          correct: [this.question.cause.value],
          label: this.question.cause.label
        }
        this.content.push(item)
      } else if (word.includes('[[Effect_1]]')) {
        const item = {
          type: 'fillup',
          key: 'effect1',
          userSelectedAnswer: [],
          correct: [this.question.effect1.value],
          label: this.question.effect1.label
        }
        this.content.push(item)
      } else if (word.includes('[[Effect_2]]')) {
        const item = {
          type: 'fillup',
          key: 'effect2',
          userSelectedAnswer: [],
          correct: [this.question.effect2.value],
          label: this.question.effect2.label
        }
        this.content.push(item)
      } else if (word === '\n') {
        const item = {
          type: 'newline'
        }
        this.content.push(item)
      } else {
        const item = {
          type: 'text',
          value: word
        }
        this.content.push(item)
      }
    })
  }

  private validateCorrectOptions(): boolean {
    if (
      !this.question.userSelectedAnswer?.cause ||
      !this.question.userSelectedAnswer?.effect1 ||
      !this.question.userSelectedAnswer?.effect2
    ) {
      this.toasterService.danger('', `Please fill all the fillups`)
      return false
    }

    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  private calculateMarks(): number {
    const isCauseCorrect = this.question.userSelectedAnswer?.cause === this.question.cause.value
    const isEffect1Correct = this.question.userSelectedAnswer?.effect1 === this.question.effect1.value
    const isEffect2Correct = this.question.userSelectedAnswer?.effect2 === this.question.effect2.value

    if (isCauseCorrect) {
      if (isEffect1Correct && isEffect2Correct) {
        return 2
      } else if (isEffect1Correct || isEffect2Correct) {
        return 1
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  // Get all selected option with row index which is chossed by user
  private getSelectedOptionByUser() {
    const answers = {
      cause: '',
      effect1: '',
      effect2: ''
    }

    this.content.map(item => {
      if (item.type === 'fillup' && item.key === 'cause') {
        answers.cause = item.userSelectedAnswer[0]
      }

      if (item.type === 'fillup' && item.key === 'effect1') {
        answers.effect1 = item.userSelectedAnswer[0]
      }

      if (item.type === 'fillup' && item.key === 'effect2') {
        answers.effect2 = item.userSelectedAnswer[0]
      }
    })

    return answers
  }

  submit() {
    if (this.user.role.toLowerCase() !== 'admin' && this.viewMode !== 'report') {
      this.question.userSelectedAnswer = this.getSelectedOptionByUser()

      if (!this.validateCorrectOptions()) return
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
