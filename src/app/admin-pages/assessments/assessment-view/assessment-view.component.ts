import {AfterViewInit, Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core'
import {NbDialogRef, NbStepperComponent} from '@nebular/theme'
import {AssessmentsApi} from 'app/services/apis/assessments.service'

@Component({
  selector: 'ngx-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
  providers: [AssessmentsApi],
  styles: [
    `
      :host nb-tab {
        padding: 1.25rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentViewComponent implements AfterViewInit {
  @ViewChild('assessmentStepper') assessmentStepper: NbStepperComponent
  assessment = null
  assessmentId: string
  tabselectedIndex = 0
  assessmentMarks = 0

  constructor(
    private assessmentsService: AssessmentsApi,
    private cdr: ChangeDetectorRef,
    protected dialogRef: NbDialogRef<AssessmentViewComponent>
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Call your API inside the setTimeout
      this.getAssessment(this.assessmentId)
    })
  }

  /**
   * Load assessment data, in view mode
   */
  getAssessment(id) {
    this.assessmentsService.getView(id).subscribe(assessment => {
      this.assessment = assessment

      this.calculateAssessmentMarks()
      // Manually trigger change detection
      this.cdr.detectChanges()
    })
  }

  back() {
    this.dialogRef.close()
  }

  private calculateAssessmentMarks() {
    this.assessmentMarks = 0
    this.assessment.questionsAndCaseStudies.forEach(questionAndCaseStudy => {
      if (questionAndCaseStudy.type === 'question') {
        if (questionAndCaseStudy?.question?.marks) {
          this.assessmentMarks += questionAndCaseStudy.question.marks
        }
      } else {
        questionAndCaseStudy.caseStudy.questions.forEach(question => {
          if (question?.marks) {
            this.assessmentMarks += question.marks
          }
        })
      }
    })
  }

  nextQuestion(event) {
    if (this.assessment?.questionsAndCaseStudies.length - 1 === this.assessmentStepper.selectedIndex) {
      // this.router.navigateByUrl('student/exams/over');
    } else {
      this.assessmentStepper.next()
    }
  }
}
