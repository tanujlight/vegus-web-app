import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-multiple-response-grouping',
  templateUrl: './view-multiple-response-grouping.component.html',
  styleUrls: ['./view-multiple-response-grouping.component.scss']
})
export class ViewMultipleResponseGroupingComponent implements OnInit, OnChanges {
  @Input() question: any
  showAnswer = false
  @Output() submitAnswer = new EventEmitter<any>()

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    if (this.question && (this.question.isAttempted || this.question.status === 'incorrect' || this.question.status === 'correct')) {
      this.setCorrectAnswer()
    }
  }

  setCorrectAnswer() {
    this.question.optionsArray.map((item, index) => {
      item.options.map((optionItem, optionIndex) => {
        if (this.question.userSelectedAnswer[index].indexOf(optionIndex) > -1) {
          this.question.optionsArray[index].options[optionIndex].userSelectedAnswer = true
        }
      })
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.question?.currentValue?.optionsArray !== changes?.question?.previousValue?.optionsArray) {
      this.question.optionsArray.map((item, index) => {
        item.options.map((optionItem, optionIndex) => {
          const correctFilter = item.correct.filter(a => a === optionItem.value)
          if (correctFilter.length) {
            this.question.optionsArray[index].options[optionIndex].isCorrect = true
          } else {
            this.question.optionsArray[index].options[optionIndex].isCorrect = false
          }
        })
      })
    }
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    let marks = 0
    this.question.optionsArray.map((item_, index) => {
      item_.options.map(item => {
        if (item.userSelectedAnswer) {
          if (item.isCorrect === item.userSelectedAnswer) {
            marks += 1
          } else {
            marks -= 1
          }
        }
      })
    })

    if (marks < 0) marks = 0

    return marks
  }

  // Get all selected option index which is chossed by user
  getSelectedOptionByUser() {
    const answers = {}
    this.question.optionsArray.map((item_, index_) => {
      answers[index_] = []
      item_.options.map((item, index) => {
        if (item.userSelectedAnswer) answers[index_].push(index)
      })
    })
    return answers
  }

  submit() {
    if (!this.question || !this.question.isAttempted) {
      if (!this.validateCorrectOptions()) {
        return
      }

      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }

  private validateCorrectOptions(): boolean {
    let correctFlag = true
    this.question.optionsArray.map(item_ => {
      const correctData = item_.options.filter(item => item.userSelectedAnswer)
      if (!correctData || !correctData.length) {
        correctFlag = false
      }
    })

    if (!correctFlag) {
      this.toasterService.danger('', 'Select at least one option in each row')
      return false
    }

    return true
  }
}
