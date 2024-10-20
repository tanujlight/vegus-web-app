import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {MultipleResponseNQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-multiple-response-n',
  templateUrl: './multiple-response-n.component.html'
})
export class MultipleResponseNComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: MultipleResponseNQuestion
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
      optionsArray: [
        {
          value: '',
          isCorrect: false
        },
        {
          value: '',
          isCorrect: false
        },
        {
          value: '',
          isCorrect: false
        },
        {
          value: '',
          isCorrect: false
        }
      ],
      optionsCount: 4,
      selectedOptions: 1
    }
  }

  optionCountChange() {
    if (this.question.optionsCount < 2) {
      this.toasterService.danger('', `Minimum number of option will be 2`)
      return
    }
    if (this.question.optionsCount > 15) {
      this.toasterService.danger('', `Maximum number of option will be 15`)
      return
    }
    const changeNeeded = this.question.optionsCount - this.question.optionsArray.length
    if (changeNeeded > 0) {
      for (let i = 0; i < changeNeeded; i++) {
        this.question.optionsArray.push({
          value: '',
          isCorrect: false
        })
      }
    } else {
      for (let i = 0; i < changeNeeded * -1; i++) {
        this.question.optionsArray.pop()
      }
    }
  }

  onSubmit() {
    if (!this.question.selectedOptions || this.question.selectedOptions < 1) {
      this.toasterService.danger('', `Number of selected option should be alteast 1`)
      return
    }
    if (!this.question.optionsCount) {
      this.toasterService.danger('', `Number of option is required`)
      return
    }
    if (this.question.optionsCount < 2) {
      this.toasterService.danger('', `Minimum number of option will be 2`)
      return
    }
    if (this.question.optionsCount <= this.question.selectedOptions) {
      this.toasterService.danger('', `Number of selected option should be less than number of options`)
      return
    }
    const emptyData = this.question.optionsArray.filter(item => !item.value)
    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Options are required`)
      return
    }

    const correctData = this.question.optionsArray.filter(item => item.isCorrect)

    if (correctData.length !== this.question.selectedOptions) {
      this.toasterService.danger('', `Please select ${this.question.selectedOptions} correct options`)
      return
    }

    const sendData = {
      optionsCount: this.question.optionsCount,
      optionsArray: this.question.optionsArray,
      selectedOptions: this.question.selectedOptions,
      marks: this.question.selectedOptions
    }
    this.save.emit(sendData)
  }
}
