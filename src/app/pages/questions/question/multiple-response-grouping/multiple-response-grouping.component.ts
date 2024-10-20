import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-multiple-response-grouping',
  templateUrl: './multiple-response-grouping.component.html',
  styleUrls: ['./multiple-response-grouping.component.scss']
})
export class MultipleResponseGroupingComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: any
  @Output() save = new EventEmitter<any>()
  prevColumnsCount = null
  constructor(private toasterService: NbToastrService) {
    this.question = {
      heading1: '',
      heading2: '',
      optionsArray: [],
      rowsCount: null,
      columnsCount: null
    }
  }

  ngOnInit(): void {
    this.submitClickedSubscription = this.submitClicked.subscribe(() => this.onSubmit())
  }

  ngOnDestroy() {
    this.submitClickedSubscription.unsubscribe()
  }

  rowsCountChange() {
    if (!(this.question.columnsCount >= 2 && this.question.columnsCount <= 10)) {
      this.toasterService.danger('', `Number of options in a row should be 1 to 10`)
      return
    }

    if (this.question.rowsCount < 1) {
      this.toasterService.danger('', `Number of rows should be greater than 0`)
      return
    }

    if (this.question.rowsCount > 20) {
      this.toasterService.danger('', `Maximum number of rows should not be more than 20`)
      return
    }

    if (this.question.rowsCount && this.question.columnsCount) {
      const currentRowCount = this.question.optionsArray.length
      const targetRowCount = this.question.rowsCount

      // Check if the current row count is less than the target row count
      if (currentRowCount < targetRowCount) {
        // Add new rows
        const rowsToAdd = targetRowCount - currentRowCount

        for (let i = 0; i < rowsToAdd; i++) {
          const newRow = {
            value: '',
            options: [],
            correct: []
          }

          for (let j = 0; j < this.question.columnsCount; j++) {
            newRow.options.push({value: ''})
          }

          this.question.optionsArray.push(newRow)
        }
      } else if (currentRowCount > targetRowCount) {
        // Remove excess rows
        const rowsToRemove = currentRowCount - targetRowCount
        this.question.optionsArray.splice(targetRowCount, rowsToRemove)
      }
      const headingChangeNeeded = this.question.columnsCount - this.prevColumnsCount
      if (headingChangeNeeded > 0) {
        if (this.prevColumnsCount) {
          for (let j = 0; j < this.question.optionsArray.length; j++) {
            for (let k = 0; k < headingChangeNeeded; k++) {
              this.question.optionsArray[j].options.push({
                value: ''
              })
            }
          }
        }
      } else if (this.prevColumnsCount) {
        for (let j = 0; j < this.question.optionsArray.length; j++) {
          for (let k = 0; k < headingChangeNeeded * -1; k++) {
            this.question.optionsArray[j].options.pop()
          }
        }
      }

      // Update prevColumnsCount based on the number of columns in the first row
      this.prevColumnsCount = this.question.columnsCount
    }
  }

  onSubmit() {
    if (!this.question.rowsCount) {
      this.toasterService.danger('', `Number of rows is required`)
      return
    }

    if (this.question.rowsCount < 1) {
      this.toasterService.danger('', `Number of rows should be greater than 0`)
      return
    }

    if (this.question.rowsCount > 20) {
      this.toasterService.danger('', `Maximum number of rows should not more than 20`)
      return
    }

    if (!this.question.columnsCount) {
      this.toasterService.danger('', `Number of options in a row is required`)
      return
    }
    if (!(this.question.columnsCount >= 2 && this.question.columnsCount <= 10)) {
      this.toasterService.danger('', `Number of options in a row should be 2 to 10`)
      return
    }
    if (!this.question.heading1 || !this.question.heading2) {
      this.toasterService.danger('', `Headings are required`)
      return
    }

    const emptyData = this.question.optionsArray.filter(item => !item.value)
    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Option 1st columns are required`)
      return
    }
    let flag = true
    this.question.optionsArray.map(item => {
      item.options.map(optionItem => {
        if (!optionItem.value) {
          flag = false
        }
      })
    })
    if (!flag) {
      this.toasterService.danger('', `Option 2nd columns are required`)
      return
    }
    const emptyData_ = this.question.optionsArray.filter(item => !item.correct.length)
    if (emptyData_ && emptyData_.length) {
      this.toasterService.danger('', `Option answer are required`)
      return
    }
    let marks = 0
    this.question.optionsArray.map(item => {
      marks += item.correct.length
    })
    const sendData = {
      heading1: this.question.heading1,
      heading2: this.question.heading2,
      rowsCount: this.question.rowsCount,
      columnsCount: this.question.columnsCount,
      optionsArray: this.question.optionsArray,
      marks: marks
    }
    this.save.emit(sendData)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.question?.currentValue !== changes?.question?.previousValue && !changes?.question?.currentValue) {
      this.question = {
        optionsArray: [],
        rowsCount: null,
        columnsCount: null
      }
    }
    if (changes?.question?.currentValue) {
      this.prevColumnsCount = changes?.question?.currentValue.optionsArray[0].options.length
    }
  }
}
