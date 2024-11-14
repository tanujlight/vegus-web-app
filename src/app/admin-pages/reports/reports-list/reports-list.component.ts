import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, ParamMap, Router} from '@angular/router'
import {ReportsApi} from 'app/services/apis/reports.service'
import {Location} from '@angular/common'

@Component({
  selector: 'ngx-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  tableHeading = ''
  examId
  studentsList = []
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
          title: '<i class="nb-compose" data-toggle="tooltip" data-placement="top" title="View report"></i>'
        }
      ]
    }
  }
  constructor(
    private route: ActivatedRoute,
    private _location: Location,
    private router: Router,
    private reportsApi: ReportsApi
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.examId = params.examId
    })
    this.initializeTableColumns()
    this.getStudentListForExam()
  }

  private initializeTableColumns() {
    this.tableColumns = {
      uniqueIdentifier: {
        title: 'ID',
        type: 'string',
        editable: false
      },
      name: {
        title: 'Name',
        editable: false
      },
      userScore: {
        title: 'Score',
        editable: false,
        sort: true,
        sortDirection: 'desc',
        valuePrepareFunction: (cell, row) => {
          const percentage = ((row.userScore / row.exam.totalMarks) * 100).toFixed(2)
          return `${row.userScore} (${percentage}%)`
        }
      }
    }
  }

  back() {
    this._location.back()
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'view':
        this.routeTo(`admin/reports/view/${event.data.id}`)
        break

      default:
        break
    }
  }

  routeTo(path): void {
    this.router.navigateByUrl(path)
  }

  getStudentListForExam() {
    this.reportsApi.getExamReports({examId: this.examId}).subscribe((reports: any[]) => {
      this.studentsList = reports
      this.studentsList.map(student => {
        if (student && student.user) {
          student.name = `${student.user.firstName} ${student.user.lastName}`
          return student
        }
      })

      this.tableHeading = `${this.studentsList[0].exam.title}`
    })
  }
}
