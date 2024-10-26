import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NbToastrService } from '@nebular/theme'
import { CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'ngx-view-bow-tie',
  templateUrl: './view-bow-tie.component.html',
  styleUrls: ['./view-bow-tie.component.scss']
})
export class ViewBowTieComponent implements OnInit {
  @Input() question: any
  @Output() submitAnswer = new EventEmitter<any>()
  showAnswer = false
  userSelectedAnswer = {
    action1: [],
    action2: [],
    condition: [],
    param1: [],
    param2: [],
  };

  constructor(private toasterService: NbToastrService) { }

  ngOnInit(): void {
    if (this.question && (this.question.isAttempted || this.question.status === 'incorrect' || this.question.status === 'correct')) {
      this.setCorrectAnswer()
    }
  }

  setCorrectAnswer() {
    this.userSelectedAnswer = this.question.userSelectedAnswer;
    this.question.actionsArray.map((item, index) => {
      if (item.value === this.userSelectedAnswer.action1[0].value) {
        this.question.actionsArray[index].userSelectedAnswer = true;
      }
      if (item.value === this.userSelectedAnswer.action2[0].value) {
        this.question.actionsArray[index].userSelectedAnswer = true;
      }
    });
    this.question.conditionsArray.map((item, index) => {
      if (item.value === this.userSelectedAnswer.condition[0].value) {
        this.question.conditionsArray[index].userSelectedAnswer = true;
      }
    });
    this.question.paramsArray.map((item, index) => {
      if (item.value === this.userSelectedAnswer.param1[0].value) {
        this.question.paramsArray[index].userSelectedAnswer = true;
      }
      if (item.value === this.userSelectedAnswer.param2[0].value) {
        this.question.paramsArray[index].userSelectedAnswer = true;
      }
    });
  }

  droptoList(event: CdkDragDrop<string[]>): void {
    if (!(event.previousContainer === event.container)) {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
      if (event.container.data.length > 1) {
        transferArrayItem(event.container.data, event.previousContainer.data, 1, 0)
      }
    }
  }

  private validateCorrectOptions(): boolean {
    if (!this.userSelectedAnswer.action1.length || !this.userSelectedAnswer.action2.length) {
      this.toasterService.danger('', `Fill all Actions to take`)
      return false
    }
    if (!this.userSelectedAnswer.condition.length) {
      this.toasterService.danger('', `Fill Potential Condition`)
      return false
    }
    if (!this.userSelectedAnswer.param1.length || !this.userSelectedAnswer.param2.length) {
      this.toasterService.danger('', `Fill all Parameters To Monitor`)
      return false
    }
    return true
  }

  // Calculate Marks on the basis of what use have selectes in UI as answer.
  private calculateMarks(): number {
    let marks = 0
    if (this.userSelectedAnswer.action1[0].isCorrect) {
      marks += 1
    }
    if (this.userSelectedAnswer.action2[0].isCorrect) {
      marks += 1
    }
    if (this.userSelectedAnswer.condition[0].isCorrect) {
      marks += 1
    }
    if (this.userSelectedAnswer.param1[0].isCorrect) {
      marks += 1
    }
    if (this.userSelectedAnswer.param2[0].isCorrect) {
      marks += 1
    }
    return marks
  }

  // Get all selected option with row index which is chossed by user
  private getSelectedOptionByUser() {
    const answers = this.userSelectedAnswer;
    return answers
  }

  submit() {
    if (!this.question || !this.question.isAttempted) {
      if (!this.validateCorrectOptions()) return
      this.question.userSelectedAnswer = this.getSelectedOptionByUser()
      this.question.isAttempted = true
      this.question.marksObtained = this.calculateMarks()
    }
    this.submitAnswer.emit()
  }

}
