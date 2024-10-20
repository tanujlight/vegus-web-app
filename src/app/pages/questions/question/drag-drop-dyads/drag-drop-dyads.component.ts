import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {DragDropDyadsQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-drag-drop-dyads',
  templateUrl: './drag-drop-dyads.component.html'
})
export class DragDropDyadsComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: DragDropDyadsQuestion
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

  selectableOptions(fillup) {
    return this.question.allOptions.filter(item => item !== fillup.value)
  }

  onSubmit() {
    if (!this.validateCauseEffect()) return

    if (!this.validateFillupsInContent()) return

    const sendData = {
      allOptions: this.question.allOptions,
      cause: this.question.cause,
      content: this.question.content,
      effect: this.question.effect,
      marks: 1
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
      effect: {
        label: '[[Effect]]',
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
    const effectPattern = new RegExp(`${this.question.effect.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    const effectMatches = this.question.content.match(effectPattern)
    if (!effectMatches || effectMatches.length !== 1) {
      this.showError('Body should contain effect')
      return false
    }

    return true
  }

  private validateCauseEffect(): boolean {
    if (!this.question.cause.value) {
      this.showError('Please select cause value')
      return false
    }
    if (!this.question.effect.value) {
      this.showError('Please select effect value')
      return false
    }

    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
