import {Component, OnInit, ViewChild} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {NbStepperComponent} from '@nebular/theme'
import {UserStore} from 'app/@core/stores/user.store'
import {ExamsApi} from 'app/services/apis/exams.service'
import {NbToastrService} from '@nebular/theme'
import {ReportsApi} from 'app/services/apis/reports.service'
import {NbSidebarService} from '@nebular/theme'
import {NbIconLibraries} from '@nebular/theme'

@Component({
  selector: 'ngx-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  @ViewChild('examStepper') examStepper: NbStepperComponent
  examId: string
  exam: any
  preparedExamForUser

  examStarted = false
  timerDisplayText = ''
  examSubmitted = false
  timer
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStore: UserStore,
    private examsService: ExamsApi,
    private toasterService: NbToastrService,
    private sidebarService: NbSidebarService,
    private reportsApi: ReportsApi,

    iconsLibrary: NbIconLibraries
  ) {
    iconsLibrary.registerFontPack('ion', {iconClassPrefix: 'ion'})
  }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId')
    this.loadExam()

    setTimeout(() => {
      this.sidebarService.compact('menu-sidebar')
    }, 100)
  }

  loadExam() {
    this.examsService.getScheduledExam(this.examId).subscribe(
      exam => {
        this.exam = exam
        this.preparedExamForUser = exam
        // this.preparedExamForUser.questionsAndCaseStudies = this.shuffleExamQuestionsAndCaseStudies(
        //   this.preparedExamForUser.questionsAndCaseStudies
        // )
      },
      () => {
        this.routeTo('student-pages/exams/list')
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

  startExam() {
    if (this.preparedExamForUser.type === 'time-based') {
      this.startTimer(this.preparedExamForUser.timeLimit)
    }

    this.examStarted = true
  }

  nextQuestion(event) {
    if (this.preparedExamForUser?.questionsAndCaseStudies.length - 1 === this.examStepper.selectedIndex) {
      this.submitExam()
    } else {
      this.examStepper.next()
    }
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  private submitExam(timeCompleted?) {
    const userExamAnswerSheet = this.prepareUserExamAnswerSheet()

    this.reportsApi.add(userExamAnswerSheet).subscribe(res => {
      if (timeCompleted) {
        this.toasterService.warning('', 'Exam time is completed and your exam is submitted!', {duration: 5000})
      } else {
        clearInterval(this.timer)
        this.toasterService.success('', 'Exam is submitted successfully!', {duration: 5000})
      }
      this.examSubmitted = true
    })
  }

  private prepareUserExamAnswerSheet() {
    return {
      exam: this.examId,
      user: this.userStore.getUser().id,
      userScore: this.calculateUserScore(),
      questionsAndCaseStudies: this.preparedExamForUser.questionsAndCaseStudies.map(item => {
        if (item.type === 'caseStudy') {
          return {
            _id: item._id,
            type: item.type,
            caseStudy: {
              id: item.caseStudy.id || item.caseStudy._id,
              questions: item.caseStudy.questions.map(q => {
                return {
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
    this.preparedExamForUser.questionsAndCaseStudies.forEach(item => {
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
        this.submitExam(true)
        clearInterval(this.timer)
      }
    }, 1000)
  }
}
