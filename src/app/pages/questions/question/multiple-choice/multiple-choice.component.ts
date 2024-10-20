import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {MultipleChoiceQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-multiple-choice',
  templateUrl: './multiple-choice.component.html'
})
export class MultipleChoiceComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: MultipleChoiceQuestion
  @Output() save = new EventEmitter<any>()

  constructor(private toasterService: NbToastrService) {
    this.initializeMultipleChoiceQuestion()
  }

  ngOnInit(): void {
    this.submitClickedSubscription = this.submitClicked.subscribe(() => this.onSubmit())
  }

  initializeMultipleChoiceQuestion() {
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
      correctOption: null,
      optionsCount: 4
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.question?.currentValue !== changes?.question?.previousValue && !changes?.question?.currentValue) {
      this.initializeMultipleChoiceQuestion()
    }

    /**
     * This is to set the correct option when the optionsArray is changed
     */
    if (changes?.question?.currentValue?.optionsArray !== changes?.question?.previousValue?.optionsArray) {
      this.question.optionsArray.map((item, index) => {
        if (item.isCorrect) {
          this.question.correctOption = index
        }
      })
    }
  }

  ngOnDestroy() {
    this.submitClickedSubscription.unsubscribe()
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
      if (this.question.correctOption + 1 > this.question.optionsArray.length) {
        this.question.correctOption = null
      }
    }
  }

  onSubmit() {
    if (!this.question.optionsCount) {
      this.toasterService.danger('', `Number of option is required`)
      return
    }
    if (this.question.optionsCount < 2) {
      this.toasterService.danger('', `Minimum number of option will be 2`)
      return
    }
    if (this.question.optionsCount > 15) {
      this.toasterService.danger('', `Maximum number of option will be 15`)
      return
    }
    const emptyData = this.question.optionsArray.filter(item => !item.value)
    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Options are required`)
      return
    }
    if (!this.question.correctOption && this.question.correctOption !== 0) {
      this.toasterService.danger('', `Select correct option`)
      return
    }

    /**
     * This is to set the correct option when the optionsArray is changed
     */
    this.question.optionsArray.forEach(option => {
      option.isCorrect = false
    })

    /**
     * This is to set the correct option when the optionsArray is changed
     */
    this.question.optionsArray[this.question.correctOption].isCorrect = true

    const sendData = {
      optionsCount: this.question.optionsCount,
      optionsArray: this.question.optionsArray,
      marks: 1
    }
    this.save.emit(sendData)
  }
}
