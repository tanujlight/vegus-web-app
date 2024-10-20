import { Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {MyToastService} from 'app/services/my-toast.service'
import {ReportsApi} from '../../../services/apis/reports.service'
import {Subject} from 'rxjs'
import { CommonReportViewComponent } from '../../../components/common-report-view/common-report-view.component'

@Component({
  selector: 'ngx-report-view',
  templateUrl: './../../../components/common-report-view/common-report-view.component.html',
  styleUrls: ['./../../../components/common-report-view/common-report-view.component.scss']
})
export class ReportViewComponent extends CommonReportViewComponent implements OnInit {

  protected readonly unsubscribe$ = new Subject<void>()

  constructor(public route: ActivatedRoute, public reportsApi: ReportsApi, public myToastService: MyToastService) {
    super(route, reportsApi, myToastService);
  }
}
