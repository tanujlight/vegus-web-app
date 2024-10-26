import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {DropDownDyadsQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-drop-down-dyads',
  templateUrl: './drop-down-dyads.component.html'
})
export class DropDownDyadsComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: DropDownDyadsQuestion
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

  onSubmit() {
    if (!this.validateCauseEffect()) return

    if (!this.validateFillupsInContent()) return

    const sendData = {
      cause: this.question.cause,
      content: this.question.content,
      effect: this.question.effect,
      marks: 1
    }
    this.save.emit(sendData)
  }

  addOption(event, keyName): void {
    const value = event.target.value.trim()

    if (value) {
      this.question[keyName].options.push(value)
    }

    event.target.value = ''
  }

  remove(option, keyName): void {
    const index_ = this.question[keyName].options.indexOf(option)
    if (index_ >= 0) {
      this.question[keyName].options.splice(index_, 1)
    }
  }

  private resetQuestion() {
    this.question = {
      content: '',
      cause: {
        label: '[[Cause]]',
        options: [],
        correct: ''
      },
      effect: {
        label: '[[Effect]]',
        options: [],
        correct: ''
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

    // if effect1 is not present in content then return false
    const effectPattern = new RegExp(`${this.question.effect.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    const effectMatches = this.question.content.match(effectPattern)
    if (!effectMatches || effectMatches.length !== 1) {
      this.showError('Body should contain effect')
      return false
    }

    return true
  }

  private validateCauseEffect(): boolean {
    if (!this.question.cause.correct || !this.question.cause.options.length) {
      this.showError('Please select cause value')
      return false
    }
    if (!this.question.effect.correct || !this.question.effect.options.length) {
      this.showError('Please select effect value')
      return false
    }

    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
