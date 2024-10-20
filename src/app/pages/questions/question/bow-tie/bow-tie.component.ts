import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-bow-tie',
  templateUrl: './bow-tie.component.html',
  styleUrls: ['./bow-tie.component.scss']
})
export class BowTieComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question
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

  addItem(type) {
    if (type === 'Action') {
      this.question.actionsArray.push({
        value: '',
        isCorrect: false
      })
    } else if (type === 'Condition') {
      this.question.conditionsArray.push({
        value: '',
        isCorrect: false
      })
    } else {
      this.question.paramsArray.push({
        value: '',
        isCorrect: false
      })
    }
  }

  removeItem(type, index) {
    if (type === 'Action') {
      this.question.actionsArray.splice(index, 1)
    } else if (type === 'Condition') {
      this.question.conditionsArray.splice(index, 1)
    } else {
      this.question.paramsArray.splice(index, 1)
    }
  }

  onSubmit() {
    const actionEmptyData = this.question.actionsArray.filter(item => !item.value)
    if (actionEmptyData && actionEmptyData.length) {
      this.showError(`Actions values are required`)
      return
    }
    const conditionEmptyData = this.question.conditionsArray.filter(item => !item.value)
    if (conditionEmptyData && conditionEmptyData.length) {
      this.showError(`Conditions values are required`)
      return
    }
    const paramsEmptyData = this.question.paramsArray.filter(item => !item.value)
    if (paramsEmptyData && paramsEmptyData.length) {
      this.showError(`Params values are required`)
      return
    }
    const actionEmptyData_ = this.question.actionsArray.filter(item => item.isCorrect)
    if (!actionEmptyData_ || actionEmptyData_.length !== 2) {
      this.showError(`Min/Max 2 correct values for Action`)
      return
    }
    const conditionEmptyData_ = this.question.conditionsArray.filter(item => item.isCorrect)
    if (!conditionEmptyData_ || conditionEmptyData_.length !== 1) {
      this.showError(`Min/Max 1 correct values for Condition`)
      return
    }
    const paramsEmptyData_ = this.question.paramsArray.filter(item => item.isCorrect)
    if (!paramsEmptyData_ || paramsEmptyData_.length !== 2) {
      this.showError(`Min/Max 2 correct values for Params`)
      return
    }
    const sendData = {
      actionsArray: this.question.actionsArray,
      conditionsArray: this.question.conditionsArray,
      paramsArray: this.question.paramsArray,
      marks: 5
    }
    this.save.emit(sendData)
  }

  private resetQuestion() {
    this.question = {
      actionsArray: [
        {
          value: '',
          isCorrect: false
        },
        {
          value: '',
          isCorrect: false
        }
      ],
      conditionsArray: [
        {
          value: '',
          isCorrect: false
        }
      ],
      paramsArray: [
        {
          value: '',
          isCorrect: false
        },
        {
          value: '',
          isCorrect: false
        }
      ]
    }
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
