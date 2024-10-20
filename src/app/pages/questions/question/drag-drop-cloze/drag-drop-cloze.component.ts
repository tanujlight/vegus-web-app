import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {DragDropClozeQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-drag-drop-cloze',
  templateUrl: './drag-drop-cloze.component.html'
})
export class DragDropClozeComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: DragDropClozeQuestion
  @Output() save = new EventEmitter<any>()

  optionInput = ''

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

  selectableOptions(fillup) {
    const alreadySelectedFillups = this.question.fillups
      .filter(item => item.value !== fillup.value)
      .map(item => item.value)

    return this.question.allOptions.filter(item => !alreadySelectedFillups.includes(item))
  }

  fillupsCountChange() {
    if (!this.validateFillupsCount()) {
      return
    }

    const changeNeeded = this.question.fillupsCount - this.question.fillups.length
    if (changeNeeded > 0) {
      for (let i = 0; i < changeNeeded; i++) {
        this.question.fillups.push({
          label: `[[Fillup_${this.question.fillups.length + 1}]]`,
          value: ''
        })
      }
    } else {
      for (let i = 0; i < changeNeeded * -1; i++) {
        this.question.fillups.pop()
      }
    }
  }

  onSubmit() {
    if (!this.validateFillupsCount()) {
      return
    }

    if (!this.question.fillups.length) {
      this.toasterService.danger('', `Please add atleast one fillup`)
      return
    }

    const emptyData = this.question.fillups.filter(item => !item.value)
    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Please add values for each fillups`)
      return
    }

    if (!this.validateFillupsInContent()) {
      this.showError(`Body should contain ${this.question.fillupsCount} fillups`)
      return
    }

    const sendData = {
      allOptions: this.question.allOptions,
      fillups: this.question.fillups,
      content: this.question.content,
      fillupsCount: this.question.fillupsCount,
      marks: this.question.fillupsCount
    }
    this.save.emit(sendData)
  }

  addOption(): void {
    const value = this.optionInput.trim()
    if (value) {
      this.question.allOptions.push(value)
    }
    this.optionInput = ''
  }

  remove(itemOption): void {
    const itemIndex = this.question.allOptions.indexOf(itemOption)
    if (itemIndex >= 0) {
      this.question.allOptions.splice(itemIndex, 1)
    }
  }

  private resetQuestion() {
    this.question = {
      content: '',
      allOptions: [],
      fillupsCount: 1,
      fillups: [
        {
          label: '[[Fillup_1]]',
          value: ''
        }
      ]
    }
  }

  private validateFillupsInContent(): boolean {
    if (!this.question.content) return false
    const fillUpNames = this.question.fillups.map(item => item.label)

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
