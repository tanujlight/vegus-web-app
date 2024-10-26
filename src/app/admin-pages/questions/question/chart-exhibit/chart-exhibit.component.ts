import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {ChartExhibitQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-chart-exhibit',
  templateUrl: './chart-exhibit.component.html'
})
export class ChartExhibitComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() questionId: string
  @Input() question: ChartExhibitQuestion
  @Output() save = new EventEmitter<any>()

  public onChartExhibitChange({editor}: any) {
    this.question.chartExhibit = editor.data.get()
  }

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
    if (changes?.question?.currentValue?.optionsArray !== changes?.question?.previousValue?.optionsArray) {
      this.question.optionsArray.map((item, index) => {
        if (item.isCorrect) {
          this.question.correctOption = index
        }
      })
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
      correctOption: null,
      optionsCount: 4,
      chartExhibit: '',
      chartExhibitTitle: ''
    }
  }

  optionCountChange() {
    if (this.question.optionsCount < 2) {
      this.toasterService.danger('', `Minimum number of option will be 2`)
      return
    }
    if (this.question.optionsCount > 20) {
      this.toasterService.danger('', `Maximum number of option will be 20`)
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
    if (!this.question.chartExhibitTitle) {
      this.toasterService.danger('', `Exhibit Title is required`)
      return
    }
    if (!this.question.chartExhibit) {
      this.toasterService.danger('', `Chart/Exhibit is required`)
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
    if (this.question.optionsCount > 20) {
      this.toasterService.danger('', `Maximum number of option will be 20`)
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
    this.question.optionsArray.map((item, index) => {
      this.question.optionsArray[index].isCorrect = false
    })
    this.question.optionsArray[this.question.correctOption].isCorrect = true
    const sendData = {
      optionsCount: this.question.optionsCount,
      optionsArray: this.question.optionsArray,
      chartExhibit: this.question.chartExhibit,
      chartExhibitTitle: this.question.chartExhibitTitle,
      marks: 1
    }
    this.save.emit(sendData)
  }
}
