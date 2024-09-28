import {Component, OnInit, OnDestroy} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {Location} from '@angular/common'
import * as moment from 'moment'
import {Router} from '@angular/router'

import {Observable, Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'

import {NbToastrService} from '@nebular/theme'

import {ExamsApi} from 'app/services/apis/exams.service'
import {Exam, QuestionAndCaseStudy, ExamStatusListWithTitle} from '../exams.interface'

export enum ExamFormMode {
  EDIT = 'Edit',
  ADD = 'Add'
}

@Component({
  selector: 'ngx-exam',
  templateUrl: './exam.component.html'
})
export class ExamComponent implements OnInit, OnDestroy {
  examForm: FormGroup

  specialInstructions = ''

  examsStatusList = ExamStatusListWithTitle

  examId: string

  totalMarks = 0

  questionsAndCaseStudies: QuestionAndCaseStudy[] = []

  protected readonly unsubscribe$ = new Subject<void>()

  get title() {
    return this.examForm.get('title')
  }

  get status() {
    return this.examForm.get('status')
  }

  get type() {
    return this.examForm.get('type')
  }

  get timeLimit() {
    return this.examForm.get('timeLimit')
  }

  get startDate() {
    return this.examForm.get('startDate')
  }

  get endDate() {
    return this.examForm.get('endDate')
  }

  mode: ExamFormMode
  setViewMode(viewMode: ExamFormMode) {
    this.mode = viewMode
  }

  constructor(
    private examsService: ExamsApi,
    private _location: Location,
    private route: ActivatedRoute,
    private toasterService: NbToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id')

    this.initForm()
    this.loadExamData()
  }

  initForm() {
    this.examForm = this.fb.group({
      id: this.fb.control(''),
      uniqueIdentifier: this.fb.control(''),
      title: this.fb.control('', [Validators.required]),
      startDate: this.fb.control(new Date(), [Validators.required]),
      endDate: this.fb.control(moment().add(1, 'day').toDate(), [Validators.required]),
      status: this.fb.control('draft', [Validators.required]),
      type: this.fb.control('tutorial', [Validators.required]),
      timeLimit: this.fb.control(10, [])
    })
  }

  loadExamData() {
    if (this.examId) {
      this.setViewMode(ExamFormMode.EDIT)
      this.loadExam(this.examId)
    } else {
      this.setViewMode(ExamFormMode.ADD)
    }
  }

  loadExam(id?) {
    this.examsService.get(id).subscribe(exam => {
      this.examForm.setValue({
        id: exam.id || '',
        uniqueIdentifier: exam.uniqueIdentifier || '',
        title: exam.title,
        status: exam.status,
        type: exam.type,
        timeLimit: exam.timeLimit,
        startDate: moment(exam.startDate).toDate(),
        endDate: moment(exam.endDate).toDate()
      })
      this.specialInstructions = exam.specialInstructions
      this.totalMarks = exam.totalMarks
      this.questionsAndCaseStudies = exam.questionsAndCaseStudies
    })
  }

  convertToExam(value: any): Exam {
    const exam: Exam = value
    return exam
  }

  save() {
    const exam: Exam = this.convertToExam(this.examForm.value)

    if (moment(exam.startDate).isAfter(moment(exam.endDate))) {
      this.toasterService.danger('', 'End date cannot be before start date!')
      return
    }

    exam.totalMarks = this.totalMarks
    exam.specialInstructions = this.specialInstructions

    let observable = new Observable<Exam>()
    observable = exam.id ? this.examsService.update(exam) : this.examsService.add(exam)

    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.examId = res.id
        this.handleSuccessResponse()
      },
      err => {
        this.handleWrongResponse()
      }
    )
  }

  handleSuccessResponse() {
    switch (this.mode) {
      case ExamFormMode.ADD:
        this.toasterService.success('', 'Exam created!')
        this.routeTo(`pages/exams/edit/${this.examId}`)
        break
      case ExamFormMode.EDIT:
        this.toasterService.success('', 'Exam updated!')
        break
      default:
        this.toasterService.success('', 'Exam updated!')
        break
    }
  }

  handleWrongResponse() {
    // this.toasterService.danger('', `This email has already taken!`)
  }

  back() {
    this.routeTo('pages/exams/list')
  }

  private routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
