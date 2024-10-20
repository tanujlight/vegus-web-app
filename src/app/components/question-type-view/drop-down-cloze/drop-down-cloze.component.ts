import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {FILLUP_PATTERN} from '../constants'

@Component({
  selector: 'ngx-view-drop-down-cloze',
  templateUrl: './drop-down-cloze.component.html',
  styleUrls: ['./drop-down-cloze.component.scss']
})
export class DropDownClozeComponent implements OnInit {
  @Input() question: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Input() user: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  content: any[] = []

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.prepareDropDownClozeView()

    if (this.viewMode === 'report') {
      this.setCorrectAnswer()
    }
  }

  setCorrectAnswer() {
    this.question.optionsArray.map((item, index) => {
      item.userSelectedAnswer = this.question.userSelectedAnswer[index]
    })
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
  }

  getFillupIndex(value: string) {
    return this.question.optionsArray.findIndex(item => item.value === value)
  }

  private prepareDropDownClozeView() {
    const wordsArray = this.question.content.split(FILLUP_PATTERN)
    wordsArray.map((word, index) => {
      if (word.includes('[[Fillup')) {
        const item = {
          type: 'fillup',
          optionsArrayIndex: this.getFillupIndex(word)
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
    const emptyData_ = this.question.optionsArray.filter(item => !item.userSelectedAnswer)
    if (emptyData_ && emptyData_.length) {
      this.toasterService.danger('', `Select correct option for each rows`)
      return false
    }
    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  private calculateMarks(): number {
    let marks = 0
    this.question.optionsArray.map(item => {
      if (item.userSelectedAnswer && item.correct === item.userSelectedAnswer) {
        marks += 1
      }
    })
    return marks
  }

  // Get all selected option with row index which is chossed by user
  private getSelectedOptionByUser() {
    const answers = {}
    this.question.optionsArray.map((item, index) => {
      answers[index] = item.userSelectedAnswer
    })
    return answers
  }

  submit() {
    if (this.user.role !== 'Admin' && this.viewMode !== 'report') {
      if (!this.validateCorrectOptions()) return

      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
