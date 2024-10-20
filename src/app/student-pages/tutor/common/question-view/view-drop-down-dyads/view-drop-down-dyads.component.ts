import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {NbToastrService} from '@nebular/theme'
import {FILLUP_PATTERN} from '../../constants'
import {DropDownDyadsQuestion} from '../../../../../pages/questions/questions.interface'


@Component({
  selector: 'ngx-view-drop-down-dyads',
  templateUrl: './view-drop-down-dyads.component.html',
  styleUrls: ['./view-drop-down-dyads.component.scss']
})
export class ViewDropDownDyadsComponent implements OnInit {
  @Input() question: DropDownDyadsQuestion
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  content: any[] = []

  constructor(private toasterService: NbToastrService) {}

  ngOnInit(): void {
    this.prepareDropDownClozeView()

    if (!this.question.userSelectedAnswer) {
      this.question.userSelectedAnswer = {
        cause: '',
        effect: ''
      }
    }
  }

  private prepareDropDownClozeView() {
    const wordsArray = this.question.content.split(FILLUP_PATTERN)
    wordsArray.map((word, index) => {
      if (word.includes('[[Cause]]')) {
        const item = {
          type: 'fillup',
          key: 'cause'
        }

        this.content.push(item)
      } else if (word.includes('[[Effect]]')) {
        const item = {
          type: 'fillup',
          key: 'effect'
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
    if (!this.question.userSelectedAnswer?.cause || !this.question.userSelectedAnswer?.effect) {
      this.toasterService.danger('', `Please fill all the fillups`)
      return false
    }

    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  private calculateMarks(): number {
    const isCauseCorrect = this.question.userSelectedAnswer?.cause === this.question.cause.correct
    const isEffectCorrect = this.question.userSelectedAnswer?.effect === this.question.effect.correct

    if (isCauseCorrect && isEffectCorrect) {
      return 1
    } else {
      return 0
    }
  }

  submit() {
    if (this.question && (this.question.isAttempted || this.question.status === 'incorrect' || this.question.status === 'correct')) {
      if (!this.validateCorrectOptions()) return

      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }
}
