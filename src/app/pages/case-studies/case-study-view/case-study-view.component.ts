import {AfterViewInit, Component, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core'
import {CaseStudiesApi} from '../../../services/apis/case-studies.service'
import {NbDialogRef} from '@nebular/theme'

@Component({
  selector: 'ngx-case-study-view',
  templateUrl: './case-study-view.component.html',
  styleUrls: ['./case-study-view.component.scss'],
  providers: [CaseStudiesApi],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseStudyViewComponent implements AfterViewInit {
  @Input() caseStudyId: string
  caseStudy = null

  caseStudyMarks = 0

  constructor(
    private caseStudiesApi: CaseStudiesApi,
    private cdr: ChangeDetectorRef,
    protected dialogRef: NbDialogRef<CaseStudyViewComponent>
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Call your API inside the setTimeout
      this.getCaseStudy(this.caseStudyId)
    })
  }

  /**
   * Load caseStudy data, in view mode
   */
  getCaseStudy(id) {
    this.caseStudiesApi.getView(id).subscribe(caseStudy => {
      this.caseStudy = caseStudy
      this.calculateCaseStudyMarks()

      // Manually trigger change detection
      this.cdr.detectChanges()
    })
  }

  back() {
    this.dialogRef.close()
  }

  private calculateCaseStudyMarks() {
    this.caseStudyMarks = 0
    this.caseStudy.questions.forEach(question => {
      this.caseStudyMarks += question.marks
    })
  }
}
