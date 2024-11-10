import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core'
import {NbDialogRef} from '@nebular/theme'
import {QuestionStatusEnum} from '../../../tutor/tutor.interface'
import {INavigatorQuestion} from './navigator.interface'

@Component({
  selector: 'ngx-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit {
  tableSettings: any
  @Input() questions: INavigatorQuestion[] = []

  questionsCount = {
    correct: 0,
    incorrect: 0,
    marked: 0,
    omitted: 0,
    unseen: 0,
    total: 0
  }

  constructor(protected dialogRef: NbDialogRef<NavigatorComponent>) {
    this.initalizeTableSettings()
  }

  ngOnInit(): void {
    if (this.questions) {
      this.questionsCount = {
        correct: this.questions.filter(question => question.status === QuestionStatusEnum.correct).length,
        incorrect: this.questions.filter(question => question.status === QuestionStatusEnum.incorrect).length,
        marked: this.questions.filter(question => question.status === QuestionStatusEnum.marked).length,
        omitted: this.questions.filter(question => question.status === QuestionStatusEnum.omitted).length,
        unseen: this.questions.filter(question => question.status === QuestionStatusEnum.unseen).length,
        total: this.questions.length
      }
    }
  }

  private initalizeTableSettings() {
    this.tableSettings = {
      actions: {
        add: false,
        edit: false,
        delete: false
      },
      columns: {
        uniqueIdentifier: {
          title: 'Question#',
          filter: false,
          type: 'string',
          valuePrepareFunction: (index, row, cell) => {
            return cell.row.index + 1 + '. # ' + row.uniqueIdentifier
          }
        },
        status: {
          title: 'Status',
          filter: false,
          type: 'string'
        }
      },
      pager: {
        display: false // Disable pagination
      },
      rowClassFunction: row => {
        switch (row.data.status) {
          case QuestionStatusEnum.correct:
            return 'bg-correct'
          case QuestionStatusEnum.incorrect:
            return 'bg-incorrect'
          case QuestionStatusEnum.marked:
            return 'bg-marked'
          case QuestionStatusEnum.omitted:
            return 'bg-omitted'
          case QuestionStatusEnum.unseen:
            return 'bg-unseen'
          default:
            return 'bg-unseen'
        }
      }
    }
  }

  back() {
    this.dialogRef.close()
  }

  onUserRowSelect(event) {
    this.dialogRef.close(event.data)
  }
}
