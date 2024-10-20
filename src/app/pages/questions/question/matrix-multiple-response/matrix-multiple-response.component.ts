import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {MatrixMultipleResponseQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-matrix-multiple-response',
  templateUrl: './matrix-multiple-response.component.html'
})
export class MatrixMultipleResponseComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: MatrixMultipleResponseQuestion
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
  }

  columnCountChange() {
    if (!this.validateColumnsCount()) {
      this.question.columnsCount = this.prevColumnsCount
      return
    }

    /**
     * Ensure the question has the desired number of columns (N columns)
     * and update the options accordingly.
     */
    const desiredColumnsCount = this.question.columnsCount // Get the desired number of columns from user input

    // Check if the current columns count is different from the desired count
    if (this.question.columns.length !== desiredColumnsCount) {
      // Calculate the difference between the desired and current columns count
      const changeNeeded = desiredColumnsCount - this.question.columns.length

      if (changeNeeded > 0) {
        // Add columns to each row
        for (let j = 0; j < this.question.optionsArray.length; j++) {
          for (let i = 0; i < changeNeeded; i++) {
            this.question.optionsArray[j].options.push({isCorrect: false})
          }
        }

        for (let i = 0; i < changeNeeded; i++) {
          this.question.columns.push({
            value: ''
          })
        }
      } else if (changeNeeded < 0) {
        // Remove columns from each row
        const removeCount = -changeNeeded
        for (let j = 0; j < this.question.optionsArray.length; j++) {
          for (let i = 0; i < removeCount; i++) {
            this.question.optionsArray[j].options.pop()
          }
        }

        this.question.columns.splice(this.question.columnsCount)
      }

      // Update the question's columns count to match the desired value
      this.question.columns.length = desiredColumnsCount
    }

    // Update the previous columns count
    this.prevColumnsCount = desiredColumnsCount
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
          options: []
        }

        for (const k of this.question.columns) {
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
    const emptyHeading = this.question.columns.filter(item => !item)
    if (emptyHeading && emptyHeading.length) {
      this.showError('Headings are required')
      return
    }

    const emptyData = this.question.optionsArray.filter(item => !item.value)
    if (emptyData && emptyData.length) {
      this.showError('Options are required')
      return
    }

    const correctOptionFlag = this.question.optionsArray.every(item =>
      item.options.some(optionItem => optionItem.isCorrect)
    )
    if (!correctOptionFlag) {
      this.showError('Select correct option for each row')
      return
    }

    const sendData = {
      rowsCount: this.question.rowsCount,
      columnsCount: this.question.columnsCount,
      optionsArray: this.question.optionsArray,
      actionTitle: this.question.actionTitle,
      columns: this.question.columns,
      marks: this.getCorrectOptionsCount()
    }
    this.save.emit(sendData)
  }

  private resetQuestion() {
    this.question = {
      optionsArray: [
        {
          value: '',
          options: [{isCorrect: false}, {isCorrect: false}]
        }
      ],
      rowsCount: 1,
      actionTitle: '',
      columnsCount: 2,
      columns: [
        {
          value: ''
        },
        {
          value: ''
        }
      ]
    }
  }

  private validateColumnsCount(): boolean {
    if (this.question.columnsCount < 2) {
      this.showError('Minimum number of columns should be 2')
      return false
    }

    if (this.question.columnsCount > 10) {
      this.showError('Maximum number of columns should be 10')
      return false
    }

    return true
  }

  private validateRowsCount(): boolean {
    if (this.question.rowsCount < 1) {
      this.showError('Minimum number of rows should be 1')
      return false
    }

    if (this.question.rowsCount > 20) {
      this.showError('Maximum number of rows should be 20')
      return false
    }
    return true
  }

  private getCorrectOptionsCount(): number {
    const correctOptionCount = this.question.optionsArray.reduce((count, item) => {
      const trueCount = item.options.filter(optionItem => optionItem.isCorrect).length
      return count + trueCount
    }, 0)

    return correctOptionCount
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
