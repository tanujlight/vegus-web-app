import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {FillInTheBlanksQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-fill-in-the-blanks',
  templateUrl: './fill-in-the-blanks.component.html'
})
export class FillInTheBlanksComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: FillInTheBlanksQuestion
  @Output() save = new EventEmitter<any>()

  constructor(private toasterService: NbToastrService) {
    this.question = {
      fillInTheBlankAnswer: ''
    }
  }

  ngOnInit(): void {
    this.submitClickedSubscription = this.submitClicked.subscribe(() => this.onSubmit())
  }

  ngOnDestroy() {
    this.submitClickedSubscription.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.question?.currentValue !== changes?.question?.previousValue && !changes?.question?.currentValue) {
      this.question = {
        fillInTheBlankAnswer: ''
      }
    }
  }
  onSubmit() {
    if (!this.question.fillInTheBlankAnswer) {
      this.toasterService.danger('', `Answer is required`)
      return
    }

    const sendData = {
      fillInTheBlankAnswer: this.question.fillInTheBlankAnswer,
      marks: 1
    }

    this.save.emit(sendData)
  }
}
