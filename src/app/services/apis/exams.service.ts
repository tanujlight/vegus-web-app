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
export class ExamsApi {
  private readonly apiController: string = 'exams'

  constructor(private api: HttpService, private cryptoService: CryptoService) {}

  get examsDataSource(): DataSource {
    return this.api.getServerDataSource(`${this.api.apiUrl}/${this.apiController}`)
  }

  list(query: any = {}): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
    return this.api.get(`${this.apiController}`, {params}).pipe(map(data => data))
  }

  get(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}`).pipe(
      map(data => {
        return data
      })
    )
  }

  getView(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}/view`).pipe(
      map(data => {
        return data
      })
    )
  }

  getScheduledExam(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}/get-scheduled-exam`).pipe(
      map((data: {examData: string}) => {
        return data && this.cryptoService.decryptData(data?.examData)
      })
    )
  }

  getScheduledExams(): Observable<any> {
    return this.api.get(`${this.apiController}/get-scheduled-exams`).pipe(
      map(data => {
        return data
      })
    )
  }

  delete(id: string): Observable<boolean> {
    return this.api.delete(`${this.apiController}/${id}`)
  }

  add(item: any): Observable<any> {
    return this.api.post(this.apiController, item)
  }

  update(item: any): Observable<any> {
    return this.api.put(`${this.apiController}/${item.id}`, item)
  }

  deleteQuestionAndCaseStudy(examId: string, questionAndCaseStudyId: string): Observable<any> {
    return this.api.delete(`${this.apiController}/${examId}/questionsAndCaseStudies/${questionAndCaseStudyId}`)
  }

  duplicateExam(examId: string): Observable<any> {
    return this.api.put(`${this.apiController}/${examId}/duplicate-exam`, {})
  }

  addQuestionAndCaseStudy(examId: string, newQuestionsAndCaseStudies: any): Observable<any> {
    return this.api.put(`${this.apiController}/${examId}/questionsAndCaseStudies`, newQuestionsAndCaseStudies)
  }
}
