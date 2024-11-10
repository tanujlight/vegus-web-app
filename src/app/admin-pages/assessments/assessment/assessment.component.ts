import {Component, OnInit, OnDestroy} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {Location} from '@angular/common'
import * as moment from 'moment'
import {Router} from '@angular/router'

import {Observable, Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'

import {NbToastrService} from '@nebular/theme'

import {AssessmentsApi} from 'app/services/apis/assessments.service'
import {Assessment, QuestionAndCaseStudy, AssessmentStatusListWithTitle} from '../assessments.interface'

export enum AssessmentFormMode {
  EDIT = 'Edit',
  ADD = 'Add'
}

@Component({
  selector: 'ngx-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit, OnDestroy {
  assessmentForm: FormGroup

  specialInstructions = ''

  // assessmentsStatusList = AssessmentStatusListWithTitle

  assessmentId: string

  totalMarks = 0

  questionsAndCaseStudies: QuestionAndCaseStudy[] = []

  protected readonly unsubscribe$ = new Subject<void>()

  get title() {
    return this.assessmentForm.get('title')
  }

  // get status() {
  //   return this.assessmentForm.get('status')
  // }

  get type() {
    return this.assessmentForm.get('type')
  }

  get timeLimit() {
    return this.assessmentForm.get('timeLimit')
  }

  mode: AssessmentFormMode
  setViewMode(viewMode: AssessmentFormMode) {
    this.mode = viewMode
  }

  constructor(
    private assessmentsService: AssessmentsApi,
    private _location: Location,
    private route: ActivatedRoute,
    private toasterService: NbToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.assessmentId = this.route.snapshot.paramMap.get('id')

    this.initForm()
    this.loadAssessmentData()
  }

  initForm() {
    this.assessmentForm = this.fb.group({
      id: this.fb.control(''),
      uniqueIdentifier: this.fb.control(''),
      title: this.fb.control('', [Validators.required]),
      // status: this.fb.control('draft', [Validators.required]),
      type: this.fb.control('tutorial', [Validators.required]),
      timeLimit: this.fb.control(10, [])
    })
  }

  loadAssessmentData() {
    if (this.assessmentId) {
      this.setViewMode(AssessmentFormMode.EDIT)
      this.loadAssessment(this.assessmentId)
    } else {
      this.setViewMode(AssessmentFormMode.ADD)
    }
  }

  loadAssessment(id?) {
    this.assessmentsService.get(id).subscribe(assessment => {
      this.assessmentForm.setValue({
        id: assessment.id || '',
        uniqueIdentifier: assessment.uniqueIdentifier || '',
        title: assessment.title,
        // status: assessment.status,
        type: assessment.type,
        timeLimit: assessment.timeLimit
        // startDate: moment(assessment.startDate).toDate(),
        // endDate: moment(assessment.endDate).toDate()
      })
      this.specialInstructions = assessment.specialInstructions
      this.totalMarks = assessment.totalMarks
      this.questionsAndCaseStudies = assessment.questionsAndCaseStudies
    })
  }

  convertToAssessment(value: any): Assessment {
    const assessment: Assessment = value
    return assessment
  }

  save() {
    const assessment: Assessment = this.convertToAssessment(this.assessmentForm.value)

    assessment.totalMarks = this.totalMarks
    assessment.specialInstructions = this.specialInstructions

    let observable = new Observable<Assessment>()
    observable = assessment.id ? this.assessmentsService.update(assessment) : this.assessmentsService.add(assessment)

    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.assessmentId = res.id
        this.handleSuccessResponse()
      },
      err => {
        this.handleWrongResponse()
      }
    )
  }

  handleSuccessResponse() {
    switch (this.mode) {
      case AssessmentFormMode.ADD:
        this.toasterService.success('', 'Assessment created!')
        this.routeTo(`admin/assessments/edit/${this.assessmentId}`)
        break
      case AssessmentFormMode.EDIT:
        this.toasterService.success('', 'Assessment updated!')
        break
      default:
        this.toasterService.success('', 'Assessment updated!')
        break
    }
  }

  handleWrongResponse() {
    // this.toasterService.danger('', `This email has already taken!`)
  }

  back() {
    this.routeTo('admin/assessments/list')
  }

  private routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
