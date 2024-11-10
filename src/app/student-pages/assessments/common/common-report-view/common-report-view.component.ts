import {Component, OnInit, ViewChild} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {ReportsApi} from 'app/services/apis/reports.service'
import {MyToastService} from 'app/services/my-toast.service'
import {NbStepperComponent} from '@nebular/theme'
import {AssessmentsApi} from 'app/services/apis/assessments.service'

@Component({
  selector: 'ngx-common-report-view',
  template: ` <div></div> `
})
export class CommonReportViewComponent implements OnInit {
  @ViewChild('reportStepper') reportStepper: NbStepperComponent
  userAnswerSheet = null
  finalReport: any
  reportId
  attemptedQuestionsLength = 0
  showDetails = false
  scoredMarksInPercentage = null
  totalQuestions = 0

  constructor(
    public route: ActivatedRoute,
    public reportsApi: ReportsApi,
    public assessmentApi: AssessmentsApi,
    public myToastService: MyToastService
  ) {}

  ngOnInit() {
    this.reportId = this.route.snapshot.paramMap.get('assessmentId')
    if (this.reportId) this.getReportDetails()
  }

  getReportDetails() {
    this.assessmentApi.getUserAssessment(this.reportId).subscribe(
      report => {
        this.userAnswerSheet = report
        this.finalReport = report
        this.setAttemptedQuestionsLength()
        // this.prepareUserFinalReport()
        this.setTotalQuestions()
        this.scoredMarksInPercentage = (
          (this.userAnswerSheet.userScore / this.userAnswerSheet.totalMarks) *
          100
        ).toFixed(2)
      },
      error => {
        this.myToastService.showToast(error.error.message, 'Error', 'danger')
      }
    )
  }

  toggleShowDetails() {
    this.showDetails = !this.showDetails
  }

  nextQuestion() {
    if (this.finalReport?.questionsAndCaseStudies.length - 1 === this.reportStepper.selectedIndex) {
      this.toggleShowDetails()
    } else {
      this.reportStepper.next()
    }
  }

  previousQuestion() {
    this.reportStepper.previous()
  }

  public setTotalQuestions() {
    this.totalQuestions = 0
    this.userAnswerSheet.questionsAndCaseStudies.forEach(item => {
      if (item.type === 'caseStudy') {
        this.totalQuestions += item.caseStudy.questions.length
      } else if (item.type === 'question') {
        this.totalQuestions++
      }
    })
  }

  public setAttemptedQuestionsLength() {
    this.userAnswerSheet.questionsAndCaseStudies.forEach(item => {
      if (item.type === 'caseStudy') {
        item.caseStudy.questions.forEach(q => {
          if (q.isAttempted) this.attemptedQuestionsLength++
        })
      } else if (item.type === 'question') {
        if (item.question.isAttempted) this.attemptedQuestionsLength++
      }
    })
  }

  // public prepareUserFinalReport() {
  //   this.finalReport = this.userAnswerSheet.exam

  //   this.userAnswerSheet.questionsAndCaseStudies.forEach((item: any, itemIndex) => {
  //     if (item.type === 'caseStudy') {
  //       item.caseStudy.questions.forEach((q: any, qIndex) => {
  //         this.finalReport.questionsAndCaseStudies[itemIndex].caseStudy.questions[qIndex].userSelectedAnswer =
  //           q.userSelectedAnswer
  //         this.finalReport.questionsAndCaseStudies[itemIndex].caseStudy.questions[qIndex].isAttempted = q.isAttempted
  //         this.finalReport.questionsAndCaseStudies[itemIndex].caseStudy.questions[qIndex].marksObtained =
  //           q.marksObtained
  //       })
  //     } else if (item.type === 'question') {
  //       this.finalReport.questionsAndCaseStudies[itemIndex].question.userSelectedAnswer =
  //         item.question.userSelectedAnswer
  //       this.finalReport.questionsAndCaseStudies[itemIndex].question.isAttempted = item.question.isAttempted
  //       this.finalReport.questionsAndCaseStudies[itemIndex].question.marksObtained = item.question.marksObtained
  //     }
  //   })
  // }
}
