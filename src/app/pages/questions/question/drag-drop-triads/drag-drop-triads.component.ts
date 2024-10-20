import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {DragDropTriadsQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-drag-drop-triads',
  templateUrl: './drag-drop-triads.component.html'
})
export class DragDropTriadsComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: DragDropTriadsQuestion
  @Output() save = new EventEmitter<any>()

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

  selectableOptions(currentFillupKey) {
    if (currentFillupKey === 'cause') {
      return this.question.allOptions.filter(
        item => item !== this.question.effect1.value && item !== this.question.effect2.value
      )
    } else if (currentFillupKey === 'effect1') {
      return this.question.allOptions.filter(
        item => item !== this.question.cause.value && item !== this.question.effect2.value
      )
    } else if (currentFillupKey === 'effect2') {
      return this.question.allOptions.filter(
        item => item !== this.question.cause.value && item !== this.question.effect1.value
      )
    }

    return this.question.allOptions
  }

  onSubmit() {
    if (!this.validateCauseEffect()) return

    if (!this.validateFillupsInContent()) return

    const sendData = {
      allOptions: this.question.allOptions,
      cause: this.question.cause,
      content: this.question.content,
      effect1: this.question.effect1,
      effect2: this.question.effect2,
      marks: 2
    }
    this.save.emit(sendData)
  }

  addOption(event): void {
    const value = event.target.value.trim()

    if (value) {
      this.question.allOptions.push(value)
    }

    event.target.value = ''
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
      cause: {
        label: '[[Cause]]',
        value: ''
      },
      effect1: {
        label: '[[Effect_1]]',
        value: ''
      },
      effect2: {
        label: '[[Effect_2]]',
        value: ''
      }
    }
  }

  private validateFillupsInContent(): boolean {
    if (!this.question.content) {
      this.showError('Please enter body')
      return false
    }

    // if cause is not present in content then return false
    const causePattern = new RegExp(`${this.question.cause.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    const causeMatches = this.question.content.match(causePattern)
    if (!causeMatches || causeMatches.length !== 1) {
      this.showError('Body should contain cause')
      return false
    }

    // if effect is not present in content then return false
    const effect1Pattern = new RegExp(`${this.question.effect1.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    const effect1Matches = this.question.content.match(effect1Pattern)
    if (!effect1Matches || effect1Matches.length !== 1) {
      this.showError('Body should contain effect 1')
      return false
    }

    // if effec2 is not present in content then return false
    const effect2Pattern = new RegExp(`${this.question.effect2.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    const effect2Matches = this.question.content.match(effect2Pattern)
    if (!effect2Matches || effect2Matches.length !== 1) {
      this.showError('Body should contain effect 2')
      return false
    }

    return true
  }

  private validateCauseEffect(): boolean {
    if (!this.question.cause.value) {
      this.showError('Please select cause value')
      return false
    }
    if (!this.question.effect1.value) {
      this.showError('Please select effect value')
      return false
    }

    if (!this.question.effect2.value) {
      this.showError('Please select effect value')
      return false
    }

    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
