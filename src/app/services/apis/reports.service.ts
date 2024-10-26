/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {HttpParams} from '@angular/common/http'
import {Observable} from 'rxjs'
import {HttpService} from '../../@core/backend/common/api/http.service'
import {map} from 'rxjs/operators'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {CryptoService} from '../crypto.service'

@Injectable()
export class ReportsApi {
  private readonly apiController: string = 'reports'

  constructor(private api: HttpService, private cryptoService: CryptoService) {}

  get reportsDataSource(): DataSource {
    return this.api.getServerDataSource(`${this.api.apiUrl}/${this.apiController}`)
  }

  getUserReports(query: any = {}): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
      .set('userId', `${query.userId}`)

    return this.api.get(`${this.apiController}/get-user-reports`, {params}).pipe(
      map((data: {reports: string}) => {
        return data && this.cryptoService.decryptData(data?.reports)
      })
    )
  }

  getExamReports(query: any = {}): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
      .set('examId', `${query.examId}`)
    return this.api.get(`${this.apiController}/get-exam-reports`, {params}).pipe(
      map((data: {reports: string}) => {
        return data && this.cryptoService.decryptData(data?.reports)
      })
    )
  }

  get(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}`).pipe(
      map((data: {report: string}) => {
        return data && this.cryptoService.decryptData(data?.report)
      })
    )
  }

  getByExamIdAndUserId(query: {examId: string; userId: string}): Observable<any> {
    const params = new HttpParams().set('examId', `${query.examId}`).set('userId', `${query.userId}`)
    return this.api.get(`${this.apiController}/get-user-exam-report`, {params}).pipe(
      map((data: {report: string}) => {
        return data && this.cryptoService.decryptData(data?.report)
      })
    )
  }

  add(item: any): Observable<any> {
    return this.api.post(this.apiController, item)
  }
}
