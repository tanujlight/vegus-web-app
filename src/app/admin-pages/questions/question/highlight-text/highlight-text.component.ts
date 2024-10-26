import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-highlight-text',
  templateUrl: './highlight-text.component.html'
})
export class HighlightTextComponent implements OnInit, OnDestroy, OnChanges {
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

  extractSentencesFromParagraph(paragraph: string): string[] {
    const pattern = /\[\[\s*([^[\]]+?)\s*\]\]/g
    const matches = paragraph.match(pattern)
    if (matches) {
      // Remove the hash symbols from the matches and trim any leading/trailing spaces
      return matches.map(match => match.slice(2, -2).trim())
    }
    return []
  }

  contentChanged() {
    const options = this.extractSentencesFromParagraph(this.question.content)
    // if (!options || options.length < ) {
    //   this.showError(`Body should contain atleast 2 hightlights`)
    //   return
    // }
    this.question.allOptions = []
    options.map(item => {
      this.question.allOptions.push({
        value: item,
        correct: false
      })
    })
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
    const options = this.extractSentencesFromParagraph(this.question.content)
    if (!options || options.length < 2) {
      this.showError('Body should contain atleast 1 fillup')
      return
    }
    const correctValues = this.question.allOptions.filter(item => item.correct)
    if (!correctValues || !correctValues.length) {
      this.showError(`Select correct values`)
      return
    }
    const sendData = {
      content: this.question.content,
      allOptions: this.question.allOptions,
      marks: correctValues.length
    }
    this.save.emit(sendData)
  }

  private resetQuestion() {
    this.question = {
      content: '',
      allOptions: []
    }
  }

  private showError(message: string) {
    this.toasterService.danger('', message)
  }
}
