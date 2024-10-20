import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'

import {DragDropOrderedResponseQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-drag-drop-ordered-response',
  templateUrl: './drag-drop-ordered-response.component.html'
})
export class DragDropOrderedResponseComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: DragDropOrderedResponseQuestion
  @Output() save = new EventEmitter<any>()
  constructor(private toasterService: NbToastrService) {
    this.initializeQuestion()
  }

  ngOnInit(): void {
    this.submitClickedSubscription = this.submitClicked.subscribe(() => this.onSubmit())
  }

  ngOnDestroy() {
    this.submitClickedSubscription.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.question?.currentValue !== changes?.question?.previousValue && !changes?.question?.currentValue) {
      this.initializeQuestion()
    }
  }

  initializeQuestion() {
    this.question = {
      optionsCount: null,
      optionsArray: []
    }
  }

  optionCountChange() {
    this.question.optionsArray = []
    for (let i = 0; i < this.question.optionsCount; i++) {
      this.question.optionsArray.push({
        value: '',
        sequence: null
      })
    }
  }

  onSubmit() {
    if (!this.question.optionsCount) {
      this.toasterService.danger('', `Number of options is required`)
      return
    }
    const emptyData = this.question.optionsArray.filter(item => !item.value)
    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Options are required`)
      return
    }

    const emptySequenceData = this.question.optionsArray.filter(item => !item.sequence)
    if (emptySequenceData && emptySequenceData.length) {
      this.toasterService.danger('', `Please enter sequences for all options`)
      return
    }

    const wrongSequence = this.question.optionsArray.find(
      item => item.sequence < 1 || item.sequence > this.question.optionsArray.length
    )

    if (wrongSequence) {
      this.toasterService.danger('', `Please enter correct sequences for all options`)
      return
    }

    if (this.hasDuplicateSequence(this.question.optionsArray)) {
      this.toasterService.danger('', `Duplicate sequence found`)
      return
    }

    const sendData = {
      optionsCount: this.question.optionsCount,
      optionsArray: this.question.optionsArray,
      marks: 1
    }

    this.save.emit(sendData)
  }

  private hasDuplicateSequence(array) {
    const sequences = new Set()
    let hasDuplicate = false

    array.forEach(obj => {
      const sequence = obj.sequence
      if (sequences.has(sequence)) {
        hasDuplicate = true
        return // Exit early if duplicate sequence found
      }
      sequences.add(sequence)
    })

    return hasDuplicate
  }
}
