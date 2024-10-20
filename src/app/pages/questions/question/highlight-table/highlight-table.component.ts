import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'
import {HighlightTableQuestion} from '../../questions.interface'

@Component({
  selector: 'ngx-highlight-table',
  templateUrl: './highlight-table.component.html'
})
export class HighlightTableComponent implements OnInit, OnDestroy, OnChanges {
  private submitClickedSubscription: Subscription
  @Input() submitClicked: Observable<void>
  @Input() question: HighlightTableQuestion
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

  extractSentencesFromParagraph(paragraph: string): string[] {
    const pattern = /\[\[\s*([^[\]]+?)\s*\]\]/g
    const matches = paragraph.match(pattern)
    if (matches) {
      // Remove the hash symbols from the matches and trim any leading/trailing spaces
      return matches.map(match => match.slice(2, -2).trim())
    }
    return []
  }

  contentChanged(item, index) {
    const options = this.extractSentencesFromParagraph(item.content) || []

    // if (!options || !options.length) {
    //   this.showError(`Body should contain atleast 1 hightlights`)
    //   return
    // }

    this.question.optionsArray[index].allOptions = []
    options.map(item_ => {
      this.question.optionsArray[index].allOptions.push({
        value: item_,
        correct: false
      })
    })
  }

  onSubmit() {
    if (!this.question.heading1 || !this.question.heading2) {
      this.toasterService.danger('', `Headings are required`)
      return
    }
    if (!this.question.optionsArray.length) {
      this.toasterService.danger('', `Option values are required`)
      return
    }

    const emptyData = this.question.optionsArray.filter(item => !item.title)
    if (emptyData && emptyData.length) {
      this.toasterService.danger('', `Options title are required`)
      return
    }

    const emptyData_ = this.question.optionsArray.filter(item => !item.content)
    if (emptyData_ && emptyData_.length) {
      this.toasterService.danger('', `Options content are required`)
      return
    }

    const hasAtLeastOneFillup = this.question.optionsArray.some(question => question.allOptions.length > 0)

    if (!hasAtLeastOneFillup) {
      this.toasterService.danger('', 'At least one fillup is required for an option')
      return
    }

    const hasAtLeastOneCorrectOption = this.question.optionsArray.some(question => {
      const correctValues = question.allOptions.some(item => item.correct)
      return correctValues
    })

    if (!hasAtLeastOneCorrectOption) {
      this.showError('At least one question should have a correct value')
      return
    }

    const sendData = {
      heading1: this.question.heading1,
      heading2: this.question.heading2,
      rowsCount: this.question.rowsCount,
      optionsArray: this.question.optionsArray,
      marks: this.getCorrectOptionsCount()
    }
    this.save.emit(sendData)
  }

  private getCorrectOptionsCount(): number {
    const correctOptionCount = this.question.optionsArray.reduce((count, item) => {
      const trueCount = item.allOptions.filter(optionItem => optionItem.correct).length
      return count + trueCount
    }, 0)
    return correctOptionCount
  }

  private resetQuestion() {
    this.question = {
      optionsArray: [],
      rowsCount: 1,
      heading1: '',
      heading2: ''
    }

    while (this.question.optionsArray.length < this.question.rowsCount) {
      this.question.optionsArray.push({
        title: '',
        content: '',
        allOptions: []
      })
    }
  }

  rowsCountChange() {
    if (!this.validateRowsCount()) {
      return
    }

    const changeNeeded = this.question.rowsCount - this.question.optionsArray.length
    if (changeNeeded > 0) {
      for (let i = 0; i < changeNeeded; i++) {
        this.question.optionsArray.push({
          title: '',
          content: '',
          allOptions: []
        })
      }
    } else {
      for (let i = 0; i < changeNeeded * -1; i++) {
        this.question.optionsArray.pop()
      }
    }
  }

  private validateRowsCount(): boolean {
    if (this.question.rowsCount < 1) {
      this.showError('Minimum number of rows is 1 required')
      return false
    }

    if (this.question.rowsCount > 50) {
      this.showError('Maximum allowed number of rows is 50')
      return false
    }

    return true
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
