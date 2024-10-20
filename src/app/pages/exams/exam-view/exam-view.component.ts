import {AfterViewInit, Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core'
import {NbDialogRef, NbStepperComponent} from '@nebular/theme'
import {ExamsApi} from 'app/services/apis/exams.service'

@Component({
  selector: 'ngx-exam-view',
  templateUrl: './exam-view.component.html',
  styleUrls: ['./exam-view.component.scss'],
  providers: [ExamsApi],
  styles: [
    `
      :host nb-tab {
        padding: 1.25rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamViewComponent implements AfterViewInit {
  @ViewChild('examStepper') examStepper: NbStepperComponent;
  exam = null
  examId: string
  tabselectedIndex = 0
  examMarks = 0

  constructor(
    private examsApi: ExamsApi,
    private cdr: ChangeDetectorRef,
    protected dialogRef: NbDialogRef<ExamViewComponent>
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Call your API inside the setTimeout
      this.getExam(this.examId)
    })
  }

  /**
   * Load exam data, in view mode
   */
  getExam(id) {
    this.examsApi.getView(id).subscribe(exam => {
      this.exam = exam

      this.calculateExamMarks()
      // Manually trigger change detection
      this.cdr.detectChanges()
    })
  }

  back() {
    this.dialogRef.close()
  }

  private calculateExamMarks() {
    this.examMarks = 0
    this.exam.questionsAndCaseStudies.forEach(questionAndCaseStudy => {
      if (questionAndCaseStudy.type === 'question') {
        if (questionAndCaseStudy?.question?.marks) {
          this.examMarks += questionAndCaseStudy.question.marks
        }
      } else {
        questionAndCaseStudy.caseStudy.questions.forEach(question => {
          if (question?.marks) {
            this.examMarks += question.marks
          }
        })
      }
    })
  }

  nextQuestion(event) {
    if ((this.exam?.questionsAndCaseStudies.length - 1) === this.examStepper.selectedIndex) {
      // this.router.navigateByUrl('student-pages/exams/over');
    } else {
      this.examStepper.next();
    }
  }
}
