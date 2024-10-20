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
export class CaseStudiesApi {
  private readonly apiController: string = 'casestudies'

  constructor(private api: HttpService) {}

  caseStuidesDataSource(query: {category?: string; subCategory?: string}): DataSource {
    const uriWithParams = `${this.api.apiUrl}/${this.apiController}/?category=${query.category}&subCategory=${query.subCategory}`
    return this.api.getServerDataSource(uriWithParams)
  }

  list(query: any = {}): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
      .set('category', query.category || '')
      .set('subCategory', query.subCategory || '')
      .set('examUsage', query.examUsage || '')

    return this.api.get(`${this.apiController}`, {params}).pipe(map(data => data))
  }

  getCaseStudiesForView(query: any = {}): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
      .set('category', query.category || '')
      .set('subCategory', query.subCategory || '')
      .set('examUsage', query.examUsage || '')

    return this.api.get(`${this.apiController}/get-case-studies-for-view`, {params}).pipe(map(data => data))
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

  uploadFile(id: string, file: File): Observable<any> {
    const maxFileSize = 1 * 1024 * 1024 // Maximum file size in bytes (1MB)
    if (file.size > maxFileSize) {
      // Throw an error or handle the case where the file size exceeds the limit
      throw new Error('File size exceeds the maximum limit of 1MB.')
    }

    const formData = new FormData()
    formData.append('file', file)
    return this.api.put(`${this.apiController}/${id}/upload-file`, formData)
  }

  updateUsage(params: {ids: string[]; usage: 'practice' | 'exam' | 'assessment'}): Observable<any> {
    return this.api.post(`${this.apiController}/update-usage`, params)
  }

  removeFile(id: string, fileUrl: string): Observable<any> {
    return this.api.put(`${this.apiController}/${id}/remove-file`, {fileUrl})
  }
}
