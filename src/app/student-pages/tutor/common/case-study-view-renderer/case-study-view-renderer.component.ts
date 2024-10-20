import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core'
import {NbStepperComponent} from '@nebular/theme'
import {Observable, Subscription} from 'rxjs'

@Component({
  selector: 'ngx-tutor-case-study-view-renderer',
  templateUrl: './case-study-view-renderer.component.html',
  styleUrls: ['./case-study-view-renderer.component.scss']
})
export class CaseStudyViewRendererComponent implements OnInit, OnDestroy {
  private nextClickedSubscription: Subscription
  private prevClickedSubscription: Subscription
  @ViewChild('caseStudyStepper') caseStudyStepper: NbStepperComponent
  @Input() caseStudy: any
  @Output() submitAnswer = new EventEmitter<any>()
  @Input() nextClicked: Observable<any>
  @Input() prevClicked: Observable<any>

  @Input() goToSpecificIndex: Observable<any>
  constructor() {}

  ngOnInit(): void {
    this.nextClickedSubscription = this.nextClicked.subscribe(data => {
      if (data && data.caseStudyId && this.caseStudy['_id'] === data.caseStudyId) {
        this.moveNext()
      }
    })
    this.prevClickedSubscription = this.prevClicked.subscribe(data => {
      if (data && data.caseStudyId && this.caseStudy['_id'] === data.caseStudyId) {
        this.movePrev()
      }
    })

    this.goToSpecificIndex.subscribe(data => {
      if (data && data.caseStudyId && this.caseStudy['_id'] === data.caseStudyId) {
        this.goToStepperIndex(data.index)
      }
    })
  }

  ngOnDestroy() {
    this.nextClickedSubscription.unsubscribe()
    this.prevClickedSubscription.unsubscribe()
  }

  getFilteredTabs(question: any): any[] {
    return this.caseStudy.tabs.filter((tab: any) => question.selectedCaseStudyTabs.includes(tab._id))
  }

  nextQuestion(event, questionIndex) {
    this.submitAnswer.emit({
      questionIndex,
      isCaseStudy: true
    })
  }

  moveNext() {
    this.caseStudyStepper.next()
  }

  movePrev() {
    this.caseStudyStepper.previous()
  }

  goToStepperIndex(index: number) {
    if (this.caseStudyStepper.selectedIndex > index) {
      for (let i = this.caseStudyStepper.selectedIndex; i > index; i--) {
        this.caseStudyStepper.previous()
      }
    } else {
      for (let i = this.caseStudyStepper.selectedIndex; i < index; i++) {
        this.caseStudyStepper.next()
      }
    }
  }
}
