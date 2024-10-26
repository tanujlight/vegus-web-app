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
export class FlashCardsApi {
  private readonly apiController: string = 'flashcards'

  constructor(private api: HttpService) {}

  get flashCardsDataSource(): DataSource {
    return this.api.getServerDataSource(`${this.api.apiUrl}/${this.apiController}`)
  }

  list(query: any = {}): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', `${query.pageNumber || 1}`)
      .set('pageSize', `${query.pageSize || 10}`)
      .set('category', query.category || '')
      .set('subCategory', query.subCategory || '')

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

  removeFile(id: string, fileUrl: string): Observable<any> {
    return this.api.put(`${this.apiController}/${id}/remove-file`, {fileUrl})
  }
}
