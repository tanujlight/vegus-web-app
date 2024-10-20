import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core'
import {EQuestionType} from 'app/pages/questions/questions.interface'

@Component({
  selector: 'ngx-tutor-question-view-renderer',
  templateUrl: './question-view-renderer.component.html',
  styleUrls: ['./question-view-renderer.component.scss']
})
export class QuestionViewRendererComponent implements OnInit, OnChanges {
  public EQuestionType = EQuestionType

  public showExplanation = false
  public isQuestionAttempted = false

  public showReturnToExplanationButton: boolean = false

  @Input() question: any
  @Input() isActive: boolean
  @Input() lastCaseStudyQuestion: any = null
  @Output() submitAnswer = new EventEmitter<any>()
  appliedScoringRule = {
    rule: '0/1',
    description: `You'll gain 1 point for each right answer and no points for a wrong one.`
  }

  constructor() {}

  ngOnInit(): void {
    this.setAppliedScoringRule(this.question?.type)
    this.resetExplanationView()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isActive.currentValue !== changes.isActive.previousValue) {
      this.resetExplanationView()
    }
  }

  onSubmit(event) {
    this.resetExplanationView()
    this.question.status = this.question.marksObtained === this.question.marks ? 'correct' : 'incorrect'
    this.submitAnswer.emit(event)
  }

  private resetExplanationView() {
    const questionStatus = this.question?.status
    this.isQuestionAttempted =
      questionStatus === 'incorrect' || questionStatus === 'correct' || this.question?.isAttempted

    this.question.isAttempted = this.isQuestionAttempted

    const isCaseStudyQuestion = this.question?.caseStudy

    if (!isCaseStudyQuestion) {
      this.showExplanation = this.isQuestionAttempted
      this.showReturnToExplanationButton = false
      this.question.showAnswer = this.isQuestionAttempted
    } else {
      const lastQuestionStatus = this.lastCaseStudyQuestion?.status

      const isLastQuestionAttempted =
        lastQuestionStatus === 'incorrect' ||
        lastQuestionStatus === 'correct' ||
        this.lastCaseStudyQuestion?.isAttempted
      this.showExplanation = this.isQuestionAttempted && isLastQuestionAttempted
      this.showReturnToExplanationButton = !isLastQuestionAttempted && this.isQuestionAttempted
      this.question.showAnswer = this.isQuestionAttempted && isLastQuestionAttempted
    }
  }

  private setAppliedScoringRule(questionType: string) {
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
