import {Component, EventEmitter, Input, OnInit, Output, ElementRef, Renderer2} from '@angular/core'
import {NbDialogService, NbToastrService, NbLayoutScrollService} from '@nebular/theme'
import {Router} from '@angular/router'
import {QuestionAndCaseStudy} from '../../assessments.interface'
import {AssessmentsApi} from 'app/services/apis/assessments.service'
import {ConfirmDialogComponent} from 'app/components/confirmation-dialog/confirmation-dialog.component'
import {QuestionComponent} from '../../../questions/question/question.component'
import {CaseStudyViewComponent} from 'app/admin-pages/case-studies/case-study-view/case-study-view.component'
import {QuestionViewComponent} from 'app/admin-pages/questions/question-view/question-view.component'
import {AddQuestionAndCaseStudyComponent} from '../add-question-and-case-study/add-question-and-case-study.component'

@Component({
  selector: 'ngx-questions-and-case-studies',
  templateUrl: './questions-and-case-studies.component.html',
  styleUrls: ['./questions-and-case-studies.component.scss']
})
export class QuestionsAndCaseStudiesComponent implements OnInit {
  @Input() examId: string

  @Input() totalMarks: string

  @Output() totalMarksChange = new EventEmitter<string>()

  @Input() questionsAndCaseStudies: QuestionAndCaseStudy[] = []

  tableColumns: any = {}

  tableSettings = {
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      type: 'html',
      custom: [
        {
          name: 'view',
          title: '<i class="nb-compose"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash"></i>'
        }
      ]
    }
  }

  constructor(
    private assessmentsService: AssessmentsApi,
    private toasterService: NbToastrService,
    private dialogService: NbDialogService,
    private scrollService: NbLayoutScrollService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.initializeTableColumns()
  }

  ngOnInit(): void {}

  private initializeTableColumns() {
    this.tableColumns = {
      index: {
        title: 'Sr. No',
        type: 'string',
        filter: false,
        sort: false,
        valuePrepareFunction: (value, row, cell) => {
          const itemIndex = this.questionsAndCaseStudies.findIndex(item => item._id === row._id)
          return (itemIndex + 1).toString()
        }
      },
      type: {
        title: 'Type',
        type: 'string',
        valuePrepareFunction: (type: any) => {
          return type === 'question' ? 'Question' : 'Case Study'
        },
        filter: {
          type: 'list',
          config: {
            selectText: 'Select type',
            list: [
              {value: 'question', title: 'Question'},
              {value: 'caseStudy', title: 'Case Study'}
            ]
          }
        }
      },
      question: {
        title: 'Question',
        type: 'html',
        valuePrepareFunction: (question: any) => {
          if (!question || !question.title) return '--'
          else {
            return `<a href="/admin/questions/edit/${question._id}" class="text-primary">${question?.title}</a>`
          }
        }
      },
      caseStudy: {
        title: 'Case Study',
        type: 'html',
        valuePrepareFunction: (caseStudy: any) => {
          if (!caseStudy || !caseStudy.title) return '--'
          else {
            return `<a href="/admin/case-studies/edit/${caseStudy._id}" class="text-primary">${caseStudy?.title}</a>`
          }
        }
      }
    }
  }

  private onDeleteConfirm(event): void {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: {
          title: 'Confirm',
          message: 'Are you sure you want to remove?'
        }
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.remove(event)
        }
      })
  }

  addNewQuestion() {
    this.dialogService
      .open(QuestionComponent, {
        context: {
          isDialog: true
        },
        dialogClass: 'question-component-dialog-container',
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(addedQuestion => {
        if (addedQuestion) {
          const question: QuestionAndCaseStudy = {
            _id: addedQuestion._id,
            id: addedQuestion._id,
            type: 'question',
            question: addedQuestion
          }

          this.add([question])
        }
      })
  }

  /**
   * Method is used to scroll to the question/case study container
   * @param index
   */
  scrollToQuestionCaseStudiesContainer(index: number) {
    const itemElement = this.elementRef.nativeElement.querySelector(`#item-${index + 1}`)
    if (itemElement) {
      // Use Renderer2 to scroll
      const x = 0 // Assuming you want to scroll horizontally by 0
      const y = itemElement.offsetTop + 500 // Vertical position relative to the offsetParent
      this.scrollService.scrollTo(x, y)
    }
  }

  redirectToQuestionOrCaseStudyEditPage(event: QuestionAndCaseStudy) {
    if (event.type === 'question') {
      this.routeTo(`admin/questions/edit/${event.question.id}`)
    } else if (event.type === 'caseStudy') {
      this.routeTo(`admin/case-studies/edit/${event.caseStudy.id}`)
    }
  }

  routeTo(path: string): void {
    this.router.navigateByUrl(path)
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'view':
        this.openViewQuestionAndCaseStudyDialog(event.data)
        break

      default:
        break
    }
  }

  openAddQuestionAndCaseStudyDialog(type: 'question' | 'caseStudy') {
    this.dialogService
      .open(AddQuestionAndCaseStudyComponent, {
        context: {
          type,
          alreadyAddedQuestions: this.questionsAndCaseStudies.filter(i => i.type === 'question'),
          alreadyAddedCaseStudies: this.questionsAndCaseStudies.filter(i => i.type === 'caseStudy')
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe((questionsAndCaseStudies: QuestionAndCaseStudy[]) => {
        if (questionsAndCaseStudies && questionsAndCaseStudies.length) {
          this.add(questionsAndCaseStudies)
        }
      })
  }

  private openViewQuestionAndCaseStudyDialog(questionAndCaseStudy: QuestionAndCaseStudy) {
    if (questionAndCaseStudy.type === 'question') {
      this.dialogService.open(QuestionViewComponent, {
        context: {
          questionId: questionAndCaseStudy.question.id
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
    } else if (questionAndCaseStudy.type === 'caseStudy') {
      this.dialogService.open(CaseStudyViewComponent, {
        context: {
          caseStudyId: questionAndCaseStudy.caseStudy.id
        },
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
    }
  }

  remove(event: QuestionAndCaseStudy) {
    this.assessmentsService.deleteQuestionAndCaseStudy(this.examId, event._id).subscribe(res => {
      if (res) {
        this.questionsAndCaseStudies = res.questionsAndCaseStudies
        this.totalMarksChange.emit(res.totalMarks)

        const message = event.type === 'question' ? 'Question' : 'Case Study'
        this.toasterService.success('', `${message} deleted successfully`)
      }
    })
  }

  add(newQuestionsAndCaseStudies: QuestionAndCaseStudy[]) {
    const payload = newQuestionsAndCaseStudies.map(item => {
      return {
        _id: item._id,
        id: item.id,
        type: item.type,
        question: item.type === 'question' ? item.question.id : null,
        caseStudy: item.type === 'caseStudy' ? item.caseStudy.id : null
      }
    })

    this.assessmentsService.addQuestionAndCaseStudy(this.examId, payload).subscribe(res => {
      if (res) {
        this.questionsAndCaseStudies = res.questionsAndCaseStudies
        this.totalMarksChange.emit(res.totalMarks)

        this.toasterService.success('', `Question & Case Study added successfully`)
      }
    })
  }
}
