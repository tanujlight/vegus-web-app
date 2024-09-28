import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core'
import {QuestionsApi} from 'app/services/apis/questions.service'
import {NbDialogRef} from '@nebular/theme'

@Component({
  selector: 'ngx-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss'],
  providers: [QuestionsApi],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionViewComponent implements AfterViewInit {
  question = null
  @Input() questionId: string

  constructor(
    public questionsService: QuestionsApi,
    private cdr: ChangeDetectorRef,
    protected dialogRef: NbDialogRef<QuestionViewComponent>
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Call your API inside the setTimeout
      this.getQuestion(this.questionId)
    })
  }

  /**
   * Load question data, in edit mode
   */
  getQuestion(id) {
    this.questionsService.get(id).subscribe(question => {
      this.question = question
      // Manually trigger change detection
      this.cdr.detectChanges()
    })
  }

  back() {
    this.dialogRef.close()
  }
}
