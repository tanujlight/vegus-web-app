import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {FILLUP_PATTERN} from '../../constants'
import {DropDownTriadsQuestion} from '../../../../../admin-pages/questions/questions.interface'

@Component({
  selector: 'ngx-view-drop-down-triads',
  templateUrl: './view-drop-down-triads.component.html',
  styleUrls: ['./view-drop-down-triads.component.scss']
})
export class ViewDropDownTriadsComponent implements OnInit {
  @Input() question: DropDownTriadsQuestion
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  content: any[] = []

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.prepareDropDownTriadsView()

    if (!this.question.userSelectedAnswer) {
      this.question.userSelectedAnswer = {
        cause: '',
        effect1: '',
        effect2: ''
      }
    }
  }

  private prepareDropDownTriadsView() {
    const wordsArray = this.question.content.split(FILLUP_PATTERN)
    wordsArray.map((word, index) => {
      if (word.includes('[[Cause]]')) {
        const item = {
          type: 'fillup',
          key: 'cause'
        }

        this.content.push(item)
      } else if (word.includes('[[Effect_1]]')) {
        const item = {
          type: 'fillup',
          key: 'effect1'
        }

        this.content.push(item)
      } else if (word.includes('[[Effect_2]]')) {
        const item = {
          type: 'fillup',
          key: 'effect2'
        }

        this.content.push(item)
      } else if (word === '\n') {
        const item = {
          type: 'newline'
        }

        this.content.push(item)
      } else {
        const item = {
          type: 'text',
          value: word
        }

        this.content.push(item)
      }
    })
  }

  private validateCorrectOptions(): boolean {
    if (
      !this.question.userSelectedAnswer?.cause ||
      !this.question.userSelectedAnswer?.effect1 ||
      !this.question.userSelectedAnswer?.effect2
    ) {
      this.toasterService.danger('', `Please fill all the fillups`)
      return false
    }

    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  private calculateMarks(): number {
    const isCauseCorrect = this.question.userSelectedAnswer?.cause === this.question.cause.correct
    const isEffect1Correct = this.question.userSelectedAnswer?.effect1 === this.question.effect1.correct
    const isEffect2Correct = this.question.userSelectedAnswer?.effect2 === this.question.effect2.correct

    if (isCauseCorrect) {
      if (isEffect1Correct && isEffect2Correct) {
        return 2
      } else if (isEffect1Correct || isEffect2Correct) {
        return 1
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  submit() {
    if (!this.question || !this.question.isAttempted) {
      if (!this.validateCorrectOptions()) return

      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
