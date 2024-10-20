import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef} from '@angular/core'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-view-matrix-multiple-response',
  templateUrl: './matrix-multiple-response.component.html'
})
export class MatrixMultipleResponseComponent implements OnInit, AfterViewInit {
  @Input() question: any
  @Input() user: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false

  actionColumnWidth = 'col-4'
  questionColumnWidth = 'col-4'

  constructor(private toasterService: NbToastrService, private cdref: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.viewMode === 'report') {
      this.setCorrectAnswer()
    }
  }

  ngAfterViewInit(): void {
    this.calculateQuestionsColumnWidth()
  }

  calculateQuestionsColumnWidth() {
    const questionColumnsLength = this.question.columns.length

    if (questionColumnsLength === 1) {
      this.questionColumnWidth = 'col-6'
      this.actionColumnWidth = 'col-6'
    } else if (questionColumnsLength === 2) {
      this.questionColumnWidth = 'col-4'
      this.actionColumnWidth = 'col-4'
    } else if (questionColumnsLength < 6) {
      this.actionColumnWidth = 'col-4'
      const width = Math.floor(8 / questionColumnsLength)
      this.questionColumnWidth = `col-${width}`
    } else if (questionColumnsLength < 9) {
      this.actionColumnWidth = 'col-3'
      const width = Math.floor(9 / questionColumnsLength)
      this.questionColumnWidth = `col-${width}`
    } else {
      this.actionColumnWidth = 'col-2'
      const width = Math.floor(10 / questionColumnsLength)
      this.questionColumnWidth = `col-${width}`
    }

    this.cdref.detectChanges()
  }

  setCorrectAnswer() {
    this.question.optionsArray.map((item, index) => {
      item.options.map((optionItem, optionIndex) => {
        if (this.question.userSelectedAnswer[index].indexOf(optionIndex) > -1) {
          this.question.optionsArray[index].options[optionIndex].userSelectedAnswer = true
        }
      })
    })
  }

  toggleViewAnswer() {
    this.showAnswer = !this.showAnswer
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  calculateMarks(): number {
    let marks = 0
    this.question.optionsArray.map(item => {
      item.options.map((optionItem, optionIndex) => {
        if (optionItem.userSelectedAnswer) {
          if (optionItem.isCorrect) {
            marks += 1
          } else {
            marks -= 1
          }
        }
      })
    })

    if (marks < 0) marks = 0
    return marks
  }

  // Get all selected option with row index which is chossed by user
  getSelectedOptionByUser() {
    const answers = {}
    this.question.optionsArray.map((item, index) => {
      answers[index] = []
      item.options.map((optionItem, optionIndex) => {
        if (optionItem.userSelectedAnswer) answers[index].push(optionIndex)
      })
    })
    return answers
  }

  submit() {
    if (this.user.role !== 'Admin' && this.viewMode !== 'report') {
      if (!this.validateCorrectOptions()) {
        return
      }

      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }

  private validateCorrectOptions(): boolean {
    const hasSelectedOption = this.question.optionsArray.every(item =>
      item.options.some(optionItem => optionItem.userSelectedAnswer)
    )

    if (!hasSelectedOption) {
      this.toasterService.danger('', 'Select at least one option from each row')
      return false
    }

    return true
  }
}
