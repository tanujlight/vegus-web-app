import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {MyToastService} from 'app/services/my-toast.service'
import {ReportsApi} from '../../../services/apis/reports.service'
import {Subject} from 'rxjs'
import {CommonReportViewComponent} from './../common/common-report-view/common-report-view.component'
import {AssessmentsApi} from 'app/services/apis/assessments.service'

@Component({
  selector: 'ngx-report-view',
  templateUrl: './../common/common-report-view/common-report-view.component.html',
  styleUrls: ['./../common/common-report-view/common-report-view.component.scss']
})
export class ReportViewComponent extends CommonReportViewComponent implements OnInit {
  protected readonly unsubscribe$ = new Subject<void>()

  // constructor() {}
  constructor(
    public route: ActivatedRoute,
    public reportsApi: ReportsApi,
    public assessmentApi: AssessmentsApi,
    public myToastService: MyToastService
  ) {
    super(route, reportsApi, assessmentApi, myToastService)
  }
}
