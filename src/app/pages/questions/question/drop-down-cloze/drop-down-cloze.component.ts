import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {DropDownClozeQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-drop-down-cloze',
  templateUrl: './drop-down-cloze.component.html'
})
export class DropDownClozeComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: DropDownClozeQuestion
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

  fillupsCountChange() {
    if (!this.validateFillupsCount()) {
      this.showError('All Fillups should be present in the body')
      return
    }

    const changeNeeded = this.question.fillupsCount - this.question.optionsArray.length
    if (changeNeeded > 0) {
      for (let i = 0; i < changeNeeded; i++) {
        this.question.optionsArray.push({
          value: `[[Fillup_${this.question.optionsArray.length + 1}]]`,
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
    if (!this.validateFillupsCount()) {
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

    if (!this.validateFillupsInContent()) {
      this.showError('Body should contain all correct fillups')
      return
    }

    const sendData = {
      optionsArray: this.question.optionsArray,
      content: this.question.content,
      fillupsCount: this.question.fillupsCount,
      marks: this.question.fillupsCount
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
      content: '',
      optionsArray: [],
      fillupsCount: 1
    }
    while (this.question.optionsArray.length < this.question.fillupsCount) {
      this.question.optionsArray.push({
        value: `[[Fillup_${this.question.optionsArray.length + 1}]]`,
        options: [],
        correct: ''
      })
    }
  }

  private validateFillupsInContent(): boolean {
    if (!this.question.content) return false

    const fillUpNames = this.question.optionsArray.map(item => item.value)
    const fillUpPattern = new RegExp(
      `${fillUpNames.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')}`,
      'g'
    )
    const matches = this.question.content.match(fillUpPattern)

    if (matches && matches.length === this.question.fillupsCount) {
      return true // Fill-ups found in the string
    } else {
      return false // No fill-ups found in the string
    }
  }

  private validateFillupsCount(): boolean {
    if (this.question.fillupsCount < 1) {
      this.showError('There should be at least one fillup')
      return false
    }
    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
