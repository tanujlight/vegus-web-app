import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core'
import {NbStepperComponent} from '@nebular/theme'

@Component({
  selector: 'ngx-case-study-view-renderer',
  templateUrl: './case-study-view-renderer.component.html',
  styleUrls: ['./case-study-view-renderer.component.scss']
})
export class CaseStudyViewRendererComponent {
  @ViewChild('caseStudyStepper') caseStudyStepper: NbStepperComponent
  @Input() caseStudy: any
  @Input() userType: 'student' | 'admin' = 'student'
  @Input() viewMode: 'exam' | 'report' = 'exam'
  @Output() submitAnswer = new EventEmitter<any>()
  constructor() {}

  getFilteredTabs(question: any): any[] {
    return this.caseStudy.tabs.filter((tab: any) => question.selectedCaseStudyTabs.includes(tab._id))
  }

  nextQuestion(event) {
    if (this.caseStudy?.questions.length - 1 === this.caseStudyStepper.selectedIndex) {
      this.submitAnswer.emit(event)
    } else {
      this.caseStudyStepper.next()
    }
  }
}
