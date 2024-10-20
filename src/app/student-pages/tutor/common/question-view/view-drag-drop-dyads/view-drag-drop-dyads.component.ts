import {CdkDragDrop, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop'
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {FILLUP_PATTERN} from '../../constants'
import {DragDropDyadsQuestion} from '../../../../../pages/questions/questions.interface'

@Component({
  selector: 'ngx-view-drag-drop-dyads',
  templateUrl: './view-drag-drop-dyads.component.html',
  styleUrls: ['./view-drag-drop-dyads.component.scss']
})
export class ViewDragDropDyadsComponent implements OnInit {
  @Input() question: DragDropDyadsQuestion
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  content: any[] = []

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.prepareDropDownClozeView()

    if (!this.question.userSelectedAnswer) {
      this.question.userSelectedAnswer = {
        cause: '',
        effect: ''
      }
    }

    if (this.question && (this.question.isAttempted || this.question.status === 'incorrect' || this.question.status === 'correct')) {
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

      if (item.type === 'fillup' && item.key === 'effect') {
        item.userSelectedAnswer[0] = this.question.userSelectedAnswer.effect
      }
    })
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
      } else if (word.includes('[[Effect]]')) {
        const item = {
          type: 'fillup',
          key: 'effect',
          userSelectedAnswer: [],
          correct: [this.question.effect.value],
          label: this.question.effect.label
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
    if (!this.question.userSelectedAnswer?.cause || !this.question.userSelectedAnswer?.effect) {
      this.toasterService.danger('', `Please fill all the fillups`)
      return false
    }

    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  private calculateMarks(): number {
    const isCauseCorrect = this.question.userSelectedAnswer?.cause === this.question.cause.value
    const isEffectCorrect = this.question.userSelectedAnswer?.effect === this.question.effect.value

    if (isCauseCorrect && isEffectCorrect) {
      return 1
    } else {
      return 0
    }
  }

  // Get all selected option with row index which is chossed by user
  private getSelectedOptionByUser() {
    const answers = {
      cause: '',
      effect: ''
    }

    this.content.map(item => {
      if (item.type === 'fillup' && item.key === 'cause') {
        answers.cause = item.userSelectedAnswer[0]
      }

      if (item.type === 'fillup' && item.key === 'effect') {
        answers.effect = item.userSelectedAnswer[0]
      }
    })

    return answers
  }

  submit() {
    if (!this.question || !this.question.isAttempted) {
      this.question.userSelectedAnswer = this.getSelectedOptionByUser()

      if (!this.validateCorrectOptions()) return
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
