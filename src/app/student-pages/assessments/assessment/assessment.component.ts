import {Component, OnInit, ViewChild} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {NbStepperComponent} from '@nebular/theme'
import {UserStore} from 'app/@core/stores/user.store'
import {AssessmentsApi} from 'app/services/apis/assessments.service'
import {NbToastrService} from '@nebular/theme'
import {ReportsApi} from 'app/services/apis/reports.service'
import {NbSidebarService} from '@nebular/theme'
import {NbIconLibraries} from '@nebular/theme'
import {STUDENT_ROUTES} from 'app/constants/routes'

@Component({
  selector: 'ngx-user-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
  @ViewChild('examStepper') examStepper: NbStepperComponent
  assessmentId: string
  assessment: any
  preparedAssessmentForUser

  assessmentStarted = false
  timerDisplayText = ''
  // assessmentSubmitted = false
  timer
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStore: UserStore,
    private assessmentApi: AssessmentsApi,
    private toasterService: NbToastrService,
    private sidebarService: NbSidebarService,
    private reportsApi: ReportsApi,

    iconsLibrary: NbIconLibraries
  ) {
    iconsLibrary.registerFontPack('ion', {iconClassPrefix: 'ion'})
  }

  ngOnInit(): void {
    this.assessmentId = this.route.snapshot.paramMap.get('assessmentId')
    this.loadAssessment()

    setTimeout(() => {
      this.sidebarService.compact('menu-sidebar')
    }, 100)
  }

  loadAssessment() {
    this.assessmentApi.getUserAssessment(this.assessmentId).subscribe(assessment => {
        this.assessment = assessment
        this.preparedAssessmentForUser = assessment
        // this.preparedAssessmentForUser.questionsAndCaseStudies = this.shuffleExamQuestionsAndCaseStudies(
        //   this.preparedAssessmentForUser.questionsAndCaseStudies
        // )
      },
      () => {
        this.routeTo(STUDENT_ROUTES.EXAMS.LIST)
      }
    )
  }

  // private shuffleExamQuestionsAndCaseStudies(array: string[]): string[] {
  //   // Implement your shuffle algorithm here
  //   // This example uses the Fisher-Yates shuffle algorithm
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1))
  //     ;[array[i], array[j]] = [array[j], array[i]]
  //   }
  //   return array
  // }

  startAssessment() {
    if (this.preparedAssessmentForUser.type === 'time-based') {
      this.startTimer(this.preparedAssessmentForUser.timeLimit)
    }
    this.assessmentStarted = true
  }

  nextQuestion(event) {
    if (this.preparedAssessmentForUser?.questionsAndCaseStudies.length - 1 === this.examStepper.selectedIndex) {
      this.submitAssessment()
    } else {
      this.examStepper.next()
    }
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  private submitAssessment(timeCompleted?) {
    const userAssessmentAnswerSheet = this.prepareUserAssessmentAnswerSheet()

    this.assessmentApi.submitUserAssessment(this.assessmentId, userAssessmentAnswerSheet).subscribe(res => {
      if (timeCompleted) {
        this.toasterService.warning('', 'Assessment time is completed and your assessment is submitted!', {duration: 5000})
      } else {
        clearInterval(this.timer)
        this.toasterService.success('', 'Assessment is submitted successfully!', {duration: 5000})
      }
      this.routeTo('student/assessments/list')
      // this.assessmentSubmitted = true
    })
  }

  private prepareUserAssessmentAnswerSheet() {
    return {
      assessment: this.assessmentId,
      user: this.userStore.getUser().id,
      userScore: this.calculateUserScore(),
      questionsAndCaseStudies: this.preparedAssessmentForUser.questionsAndCaseStudies.map(item => {
        if (item.type === 'caseStudy') {
          return {
            _id: item._id,
            type: item.type,
            caseStudy: {
              id: item.caseStudy.id || item.caseStudy._id,
              questions: item.caseStudy.questions.map(q => {
                return {
                  ...item.question,
                  id: q.id || q._id,
                  userSelectedAnswer: q.userSelectedAnswer,
                  isAttempted: q.isAttempted,
                  marksObtained: q.marksObtained || 0
                }
              })
            }
          }
        } else if (item.type === 'question') {
          return {
            _id: item._id,
            type: item.type,
            question: {
              ...item.question,
              id: item.question.id || item.question._id,
              userSelectedAnswer: item.question.userSelectedAnswer,
              isAttempted: item.question.isAttempted || false,
              marksObtained: item.question.marksObtained || 0
            }
          }
        }
      })
    }
  }

  private calculateUserScore() {
    let userScore = 0
    this.preparedAssessmentForUser.questionsAndCaseStudies.forEach(item => {
      if (item.type === 'caseStudy') {
        item.caseStudy.questions.forEach(q => {
          userScore += q.marksObtained
        })
      } else if (item.type === 'question') {
        userScore += item.question.marksObtained || 0
      }
    })
    return userScore
  }

  startTimer(minute) {
    let seconds = minute * 60

    this.timer = setInterval(() => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      const hoursText = hours > 0 ? `${hours}h ` : ''
      const minutesText = minutes > 0 ? `${minutes}m ` : ''
      const secondsText = `${remainingSeconds}s`

      this.timerDisplayText = `${hoursText}${minutesText}${secondsText}`

      seconds--

      if (seconds < 0) {
        this.submitAssessment(true)
        clearInterval(this.timer)
      }
    }, 1000)
  }
}
