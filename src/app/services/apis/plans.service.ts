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

@Injectable()
export class PlansApi {
  private readonly apiController: string = 'plans'

  constructor(private api: HttpService) {}

  get flashCardsDataSource(): DataSource {
    return this.api.getServerDataSource(`${this.api.apiUrl}/${this.apiController}`)
  }

  /**
   * query : {type: 'subscription' | 'renewal'}
   */
  list(query: any = {}): Observable<any[]> {
    const params = new HttpParams().set('type', query.type || 'subscription')
    return this.api.get(`${this.apiController}`, {params}).pipe(map(data => data))
  }

  get(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}`).pipe(
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

  initializePayment(params: {planId: string; via: string}): Observable<any> {
    return this.api.post(`${this.apiController}/initialize-payment`, params)
  }

  verifyStripeSession(params: {sessionId: string}): Observable<any> {
    return this.api.post(`${this.apiController}/verify-stripe-session`, params)
  }

  getPlans(): Observable<any[]> {
    return this.api.get(`${this.apiController}/get-plans`).pipe(map(data => data))
  }
}
