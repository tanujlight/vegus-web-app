import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {ReportsApi} from 'app/services/apis/reports.service'
import {DatePipe} from '@angular/common'
import {UserStore} from 'app/@core/stores/user.store'

@Component({
  selector: 'ngx-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  tableColumns: any = {}
  reports = []

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
          title: '<i class="nb-compose" data-toggle="tooltip" data-placement="top" title="View report"></i>'
        }
      ]
    }
  }

  constructor(private reportsApi: ReportsApi, private router: Router, private userStore: UserStore) {}

  ngOnInit(): void {
    this.initializeTableColumns()
    this.getReports()
  }

  private initializeTableColumns() {
    this.tableColumns = {
      uniqueIdentifier: {
        title: 'ID',
        type: 'string',
        editable: false,
        hidden: true
      },
      examTitle: {
        title: 'Exam title',
        valuePrepareFunction: (cell, row) => {
          // Assuming the nested object property is named "exam" and has a "title" field
          return row.exam.title
        }
      },
      examTotalMarks: {
        title: 'Exam Marks',
        valuePrepareFunction: (cell, row) => {
          // Assuming the nested object property is named "exam" and has a "title" field
          return row.exam.totalMarks
        }
      },
      userScore: {
        title: 'Your Score',
        valuePrepareFunction: (cell, row) => {
          const percentage = ((row.userScore / row.exam.totalMarks) * 100).toFixed(2)
          return `${row.userScore} (${percentage}%)`
        }
      },
      createdAt: {
        title: 'Attempted On',
        type: 'string',
        sort: true,
        sortDirection: 'desc',
        editable: false,
        valuePrepareFunction: (startDate: any) => {
          return new DatePipe('en-US').transform(startDate, 'yyyy/MM/dd')
        }
      }
    }
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'view':
        this.routeTo(`student-pages/reports/view/${event.data.id}`)
        break

      default:
        break
    }
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  getReports() {
    this.reportsApi.getUserReports({userId: this.userStore.getUser().id}).subscribe((reports: any[]) => {
      this.reports = reports
    })
  }
}
