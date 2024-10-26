import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'

import {MatrixMultipleChoiceQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-matrix-multiple-choice',
  templateUrl: './matrix-multiple-choice.component.html'
})
export class MatrixMultipleChoiceComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: MatrixMultipleChoiceQuestion
  @Output() save = new EventEmitter<any>()
  prevColumnsCount = 0
  constructor(private toasterService: NbToastrService) {
    this.resetQuestion()
  }

  ngOnInit(): void {
    this.submitClickedSubscription = this.submitClicked.subscribe(() => this.onSubmit())
  }

  ngOnDestroy() {
    this.submitClickedSubscription.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.question?.currentValue !== changes?.question?.previousValue && !changes?.question?.currentValue) {
      this.resetQuestion()
    }
    if (changes?.question?.currentValue?.optionsArray !== changes?.question?.previousValue?.optionsArray) {
      this.question.optionsArray.map((item, index) => {
        item.options.map((optionItem, optionIndex) => {
          if (optionItem.isCorrect) {
            this.question.optionsArray[index].correctOption = optionIndex
          }
        })
      })
    }
  }

  columnCountChange() {
    if (!this.validateColumnsCount()) {
      this.question.columnsCount = this.prevColumnsCount
      return
    }

    /**
     * If columns count is 3 then add one more column to each row
     * Here, we are handling only 2 column to 3 column change and vice versa
     */
    if (this.question.columnsCount === 3) {
      for (let j = 0; j < this.question.optionsArray.length; j++) {
        this.question.optionsArray[j].options.push({isCorrect: false})
      }
    } else if (this.question.columnsCount === 2) {
      for (let j = 0; j < this.question.optionsArray.length; j++) {
        this.question.optionsArray[j].options.pop()
      }
    }

    this.prevColumnsCount = this.question.columnsCount
  }

  rowCountChange() {
    if (!this.validateRowsCount()) {
      return
    }

    const changeNeeded = this.question.rowsCount - this.question.optionsArray.length

    if (changeNeeded > 0) {
      for (let i = 0; i < changeNeeded; i++) {
        const optionItem = {
          value: '',
          correctOption: null,
          options: []
        }

        while (optionItem.options.length < this.question.columnsCount) {
          optionItem.options.push({isCorrect: false})
        }

        this.question.optionsArray.push(optionItem)
      }
    } else {
      this.question.optionsArray.splice(this.question.rowsCount)
    }
  }

  onSubmit() {
    if (!this.validateColumnsCount() || !this.validateRowsCount()) {
      return
    }

    if (!this.question.actionTitle) {
      this.showError('Action title is required')
      return
    }
    if (!this.question.effective) {
      this.showError('Effective is required')
      return
    }
    if (!this.question.ineffective) {
      this.showError('Ineffective is required')
      return
    }

    if (this.question.columnsCount === 3 && !this.question.unrelated) {
      this.showError('Unrelated is required')
      return
    }

    const emptyData = this.question.optionsArray.filter(item => !item.value)
    if (emptyData.length > 0) {
      this.showError('Options are required')
      return
    }

    if (!this.validateCorrectOptions()) {
      return
    }

    this.mapCorrectOptions()

    const sendData = {
      rowsCount: this.question.rowsCount,
      columnsCount: this.question.columnsCount,
      optionsArray: this.question.optionsArray,
      actionTitle: this.question.actionTitle,
      effective: this.question.effective,
      ineffective: this.question.ineffective,
      unrelated: this.question.unrelated,
      marks: this.question.rowsCount
    }

    this.save.emit(sendData)
  }

  private resetQuestion() {
    this.question = {
      optionsArray: [
        {
          value: '',
          correctOption: null,
          options: [{isCorrect: false}, {isCorrect: false}]
        },
        {
          value: '',
          correctOption: null,
          options: [{isCorrect: false}, {isCorrect: false}]
        },
        {
          value: '',
          correctOption: null,
          options: [{isCorrect: false}, {isCorrect: false}]
        },
        {
          value: '',
          correctOption: null,
          options: [{isCorrect: false}, {isCorrect: false}]
        }
      ],
      rowsCount: 4,
      actionTitle: '',
      effective: '',
      ineffective: '',
      unrelated: '',
      columnsCount: 2
    }
  }

  private mapCorrectOptions() {
    /**
     * This is to set the correct option when the optionsArray is changed
     */
    this.question.optionsArray.forEach(item => {
      item.options.forEach((optionItem, optionIndex) => {
        optionItem.isCorrect = false
      })

      item.options[item.correctOption].isCorrect = true
      delete item.correctOption
    })
  }

  private validateColumnsCount(): boolean {
    if (this.question.columnsCount < 2 || this.question.columnsCount > 3) {
      this.showError('Number of columns should be 2 to 3')
      return false
    }
    return true
  }

  private validateRowsCount(): boolean {
    if (this.question.rowsCount < 1) {
      this.showError('Number of rows should be greater than 0')
      return false
    }

    if (this.question.rowsCount > 20) {
      this.showError('Maximum number of rows is 20')
      return false
    }

    return true
  }

  private validateCorrectOptions(): boolean {
    for (const item of this.question.optionsArray) {
      if (item.correctOption === null) {
        this.showError('Select correct option for rows')
        return false
      }
    }
    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
