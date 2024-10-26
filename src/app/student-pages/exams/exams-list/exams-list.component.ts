import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {ExamsApi} from 'app/services/apis/exams.service'
import * as moment from 'moment'

@Component({
  selector: 'ngx-exams-list',
  templateUrl: './exams-list.component.html',
  styleUrls: ['./exams-list.component.scss']
})
export class ExamsListComponent implements OnInit {
  exams
  constructor(private examsApi: ExamsApi, private router: Router) {}

  ngOnInit(): void {
    this.getScheduledExams()
  }

  getScheduledExams() {
    this.exams = []
    this.examsApi.getScheduledExams().subscribe(res => {
      if (res && res.length) {
        res.map(item => {
          const disabled = this.checkDateIsBetween(item.startDate, new Date(), item.endDate)
          this.exams.push({...item, ...{disabled: !disabled}})
        })
      }
    })
  }

  takeExam(examItem) {
    this.routeTo('student/exams/' + examItem.id)
  }

  private routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  checkDateIsBetween(
    /* checking date is between start and end date */
    startDate: Date | string | moment.Moment,
    betweenDate: Date | string | moment.Moment,
    endDate: Date | string | moment.Moment
  ) {
    if (
      startDate &&
      this.isDate(startDate) &&
      betweenDate &&
      this.isDate(betweenDate) &&
      endDate &&
      this.isDate(endDate)
    ) {
      if (moment(betweenDate).isBetween(startDate, endDate)) {
        return true
      }
      return false
    }
    return false
  }

  isDate(dateVar) {
    /* checking given param is date or not */
    if (dateVar instanceof Date || moment.isMoment(dateVar)) {
      return true
    }
    const parsedDate = Date.parse(dateVar)
    return isNaN(dateVar) && !isNaN(parsedDate)
  }
}
