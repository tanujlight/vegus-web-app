import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {DropDownTriadsQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-drop-down-triads',
  templateUrl: './drop-down-triads.component.html'
})
export class DropDownTriadsComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: DropDownTriadsQuestion
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
      effect1: this.question.effect1,
      effect2: this.question.effect2,
      content: this.question.content,
      marks: 2
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
      effect1: {
        label: '[[Effect_1]]',
        options: [],
        correct: ''
      },
      effect2: {
        label: '[[Effect_2]]',
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
    const effect1Pattern = new RegExp(`${this.question.effect1.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    const effect1Matches = this.question.content.match(effect1Pattern)
    if (!effect1Matches || effect1Matches.length !== 1) {
      this.showError('Body should contain effect 1')
      return false
    }

    // if effect2 is not present in content then return false
    const effect2Pattern = new RegExp(`${this.question.effect2.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    const effect2Matches = this.question.content.match(effect2Pattern)
    if (!effect2Matches || effect2Matches.length !== 1) {
      this.showError('Body should contain effect 2')
      return false
    }

    return true
  }

  private validateCauseEffect(): boolean {
    if (!this.question.cause.correct || !this.question.cause.options.length) {
      this.showError('Please select cause value')
      return false
    }
    if (!this.question.effect1.correct || !this.question.effect1.options.length) {
      this.showError('Please select effect 1 value')
      return false
    }
    if (!this.question.effect2.correct || !this.question.effect2.options.length) {
      this.showError('Please select effect 2 value')
      return false
    }
    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
