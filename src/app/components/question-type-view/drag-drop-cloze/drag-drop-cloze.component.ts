import {CdkDragDrop, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop'
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {FILLUP_PATTERN} from '../constants'

@Component({
  selector: 'ngx-view-drag-drop-cloze',
  templateUrl: './drag-drop-cloze.component.html',
  styleUrls: ['./drag-drop-cloze.component.scss']
})
export class DragDropClozeComponent implements OnInit {
  @Input() question: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Input() user: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  content: any[] = []
  userSelectedAnswer = []

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.prepareDropDownClozeView()
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
    let index = 0
    this.content.map(item => {
      if (item.type === 'fillup') {
        item.userSelectedAnswer[0] = this.question.userSelectedAnswer[index]
        index++
      }
    })
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
  }

  private prepareDropDownClozeView() {
    let index = 0
    const wordsArray = this.question.content.split(FILLUP_PATTERN)

    wordsArray.map(word => {
      if (word.includes('[[Fillup')) {
        const answers = this.question.fillups.map(i => i.value)

        const item = {
          type: 'fillup',
          label: word,
          userSelectedAnswer: [],
          correct: answers || [],
          optionsArrayIndex: index++
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
    const emptyData_ = this.content.filter(item => item.type === 'fillup' && !item.userSelectedAnswer.length)
    if (emptyData_ && emptyData_.length) {
      this.toasterService.danger('', `Fill all blank spaces`)
      return false
    }
    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  private calculateMarks(): number {
    let marks = 0
    this.content.map(item => {
      if (item.type === 'fillup') {
        if (item.correct.includes(item.userSelectedAnswer[0])) {
          marks += 1
        }
      }
    })
    return marks
  }

  // Get all selected option with row index which is chossed by user
  private getSelectedOptionByUser() {
    const answers = {}
    let index = 0
    this.content.map(item => {
      if (item.type === 'fillup') {
        answers[index] = item.userSelectedAnswer[0]
        index++
      }
    })
    return answers
  }

  submit() {
    if (this.user.role.toLowerCase() !== 'admin' && this.viewMode !== 'report') {
      if (!this.validateCorrectOptions()) return
      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
