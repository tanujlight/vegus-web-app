import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {User} from '../../@core/interfaces/common/users'
import {UserStore} from '../../@core/stores/user.store'
import {EQuestionType} from 'app/pages/questions/questions.interface'

@Component({
  selector: 'ngx-question-view-renderer',
  templateUrl: './question-view-renderer.component.html',
  styleUrls: ['./question-view-renderer.component.scss']
})
export class QuestionViewRendererComponent implements OnInit {
  public EQuestionType = EQuestionType

  @Input() question: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Output() submitAnswer = new EventEmitter<any>()
  user: User = null
  appliedScoringRule = {
    rule: '0/1',
    description: `You'll gain 1 point for each right answer and no points for a wrong one.`
  }

  constructor(private userStore: UserStore) {}

  ngOnInit(): void {
    this.user = this.userStore.getUser()
    this.setAppliedScoringRule(this.question?.type)
  }

  setAppliedScoringRule(questionType: string) {
    if (
      questionType === EQuestionType.MATRIX_MULTIPLE_CHOICE ||
      questionType === EQuestionType.MULTIPLE_RESPONSE_N ||
      questionType === EQuestionType.MULTIPLE_CHOICE ||
      questionType === EQuestionType.DROP_DOWN_CLOZE ||
      questionType === EQuestionType.DRAG_DROP_CLOZE ||
      questionType === EQuestionType.AUDIO ||
      questionType === EQuestionType.VIDEO ||
      questionType === EQuestionType.CHART_EXHIBIT ||
      questionType === EQuestionType.DROP_DOWN_TABLE ||
      questionType === EQuestionType.BOWTIE ||
      questionType === EQuestionType.FILL_IN_THE_BLANKS ||
      questionType === EQuestionType.GRAPHIC_IN_ANSWER ||
      questionType === EQuestionType.GRAPHIC_IN_QUESTION ||
      questionType === EQuestionType.DRAG_DROP_ORDERED_RESPONSE
    ) {
      this.appliedScoringRule = {
        rule: '0/1',
        description: `You'll gain 1 point for each right answer and no points for a wrong one.`
      }
    } else if (
      questionType === EQuestionType.MATRIX_MULTIPLE_RESPONSE ||
      questionType === EQuestionType.MULTIPLE_RESPONSE_GROUPING ||
      questionType === EQuestionType.HIGHLIGHT_TABLE ||
      questionType === EQuestionType.HIGHLIGHT_TEXT ||
      questionType === EQuestionType.MULTIPLE_RESPONSE
    ) {
      this.appliedScoringRule = {
        rule: '+/-',
        description:
          'You will receive 1 point for every accurate answer, lose 1 point for every incorrect answer, and your score cannot go below zero.'
      }
    } else if (questionType === EQuestionType.DRAG_DROP_DYADS || questionType === EQuestionType.DROP_DOWN_DYADS) {
      this.appliedScoringRule = {
        rule: 'Rational',
        description: 'You will receive 1 point when both responses in the pair are correct (orders matter).'
      }
    } else if (questionType === EQuestionType.DROP_DOWN_TRIADS || questionType === EQuestionType.DRAG_DROP_TRIADS) {
      this.appliedScoringRule = {
        rule: 'Rational',
        description: 'Cause must be right for any credit, partial credit(1 point) is given if only 1 effect is correct'
      }
    }
  }
}
