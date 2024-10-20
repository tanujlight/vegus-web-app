import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {DropDownTableQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-drop-down-table',
  templateUrl: './drop-down-table.component.html'
})
export class DropDownTableComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: DropDownTableQuestion
  @Output() save = new EventEmitter<any>()
  optionValue = []
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

  rowsCountChange() {
    if (!this.validateRowsCount()) {
      return
    }

    const changeNeeded = this.question.rowsCount - this.question.optionsArray.length
    if (changeNeeded > 0) {
      for (let i = 0; i < changeNeeded; i++) {
        this.question.optionsArray.push({
          value: '',
          options: [],
          correct: ''
        })
      }
    } else {
      for (let i = 0; i < changeNeeded * -1; i++) {
        this.question.optionsArray.pop()
      }
    }
  }

  onSubmit() {
    if (!this.validateRowsCount()) {
      return
    }

    if (!this.question.heading1 || !this.question.heading2) {
      this.toasterService.danger('', `Headings are required`)
      return
    }
    if (!this.question.optionsArray.length) {
      this.toasterService.danger('', `Option values are required`)
      return
    }

    const emptyData = this.question.optionsArray.filter(item => !item.value)
    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Options are required`)
      return
    }

    const emptyData_ = this.question.optionsArray.filter(item => !item.correct)
    if (emptyData_ && emptyData_.length) {
      this.toasterService.danger('', `Option answer are required`)
      return
    }
    const sendData = {
      heading1: this.question.heading1,
      heading2: this.question.heading2,
      rowsCount: this.question.rowsCount,
      optionsArray: this.question.optionsArray,
      marks: this.question.rowsCount
    }
    this.save.emit(sendData)
  }

  addOption(index): void {
    const value = this.optionValue[index].trim()
    if (value) {
      this.question.optionsArray[index].options.push(value)
    }
    this.optionValue[index] = ''
  }

  remove(fruit, index): void {
    const index_ = this.question.optionsArray[index].options.indexOf(fruit)
    if (index_ >= 0) {
      this.question.optionsArray[index].options.splice(index_, 1)
    }
  }

  private resetQuestion() {
    this.question = {
      optionsArray: [],
      rowsCount: 1,
      heading1: '',
      heading2: ''
    }

    while (this.question.optionsArray.length < this.question.rowsCount) {
      this.question.optionsArray.push({
        value: '',
        options: [],
        correct: ''
      })
    }
  }

  private validateRowsCount(): boolean {
    if (this.question.rowsCount < 1) {
      this.showError('Minimum number of rows will be 1')
      return false
    }

    if (this.question.rowsCount > 50) {
      this.showError('Maximum number of rows will be 50')
      return false
    }

    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
