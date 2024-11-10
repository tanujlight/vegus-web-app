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
export class AssessmentsApi {
  private readonly apiController: string = 'assessments'

  constructor(private api: HttpService, private cryptoService: CryptoService) {}

  get assessmentsDataSource(): DataSource {
    return this.api.getServerDataSource(`${this.api.apiUrl}/${this.apiController}`)
  }

  list(query: any = {}): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
    return this.api.get(`${this.apiController}`, {params}).pipe(map(data => data))
  }

  userAssessmentList(query: any = {}): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
    return this.api.get(`${this.apiController}/user-assessments`, {params}).pipe(map(data => data))
  }

  getUserAssessment(assessmentId: string): Observable<any> {
    return this.api.get(`${this.apiController}/user-assessments/${assessmentId}`).pipe(
      map(data => {
        return data
      })
    )
  }

  submitUserAssessment(id: string, params: any): Observable<any> {
    return this.api.put(`${this.apiController}/user-assessments/${id}/submit`, params)
  }

  activateUserAssessment(id): Observable<any> {
    return this.api.post(`${this.apiController}/user-assessments/${id}/activate`, '')
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

  delete(id: string): Observable<boolean> {
    return this.api.delete(`${this.apiController}/${id}`)
  }

  add(item: any): Observable<any> {
    return this.api.post(this.apiController, item)
  }

  update(item: any): Observable<any> {
    return this.api.put(`${this.apiController}/${item.id}`, item)
  }

  deleteQuestionAndCaseStudy(assessmentId: string, questionAndCaseStudyId: string): Observable<any> {
    return this.api.delete(`${this.apiController}/${assessmentId}/questions-and-case-studies/${questionAndCaseStudyId}`)
  }

  addQuestionAndCaseStudy(assessmentId: string, newQuestionsAndCaseStudies: any): Observable<any> {
    return this.api.put(`${this.apiController}/${assessmentId}/questions-and-case-studies`, newQuestionsAndCaseStudies)
  }
}
