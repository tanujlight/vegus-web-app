import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {AssessmentsApi} from 'app/services/apis/assessments.service'
import {User} from '../../../@core/interfaces/common/users'
import {UserStore} from 'app/@core/stores/user.store'

@Component({
  selector: 'ngx-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {
  noAssessments = true

  userStartedAssessments = []

  userExpiredAssessments = []

  userCompletedAssessments = []
  availableAssessments = []
  user: User = null
  constructor(private assessmentApi: AssessmentsApi, private router: Router, private userStore: UserStore) {}

  ngOnInit(): void {
    this.getAssessments()
    this.user = this.userStore.getUser()
  }

  getAssessments() {
    this.assessmentApi.userAssessmentList().subscribe((res: any) => {
      this.availableAssessments = res.availableAssessments || []
      this.userStartedAssessments = res.userStartedAssessments || []
      this.userCompletedAssessments = res.userCompletedAssessments || []
      this.userExpiredAssessments = res.userExpiredAssessments || []

      if (
        this.availableAssessments.length > 0 ||
        this.userStartedAssessments.length > 0 ||
        this.userCompletedAssessments.length > 0 ||
        this.userExpiredAssessments.length > 0
      ) {
        this.noAssessments = false
      }

      this.availableAssessments = this.availableAssessments.map(assessment => {
        if (this.user.role === 'subscriber') {
          assessment.disabled = this.user.subscription.isActive === false ? true : false
        } else if (this.user.role === 'user') {
          assessment.disabled = this.user.classDetails.assessmentsEnabled === false ? true : false
        }

        return assessment
      })
    })
  }

  activateUserAssessment(assessment) {
    this.assessmentApi.activateUserAssessment(assessment._id).subscribe((res: any) => {
      this.getAssessments()
    })
  }

  takeUserAssessment(userAssessment) {
    if (userAssessment.status === 'completed') {
      this.routeTo('student/assessments/report/' + userAssessment.assessment)
    } else {
      this.routeTo('student/assessments/' + userAssessment.assessment)
    }
  }

  viewUserAssessment(userAssessment) {
    this.routeTo('student/assessments/report/' + userAssessment.assessment)
  }

  private routeTo(path): void {
    this.router.navigateByUrl(path)
  }
}
