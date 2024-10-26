/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {HttpParams} from '@angular/common/http'
import {Observable, of} from 'rxjs'
import {HttpService} from '../../@core/backend/common/api/http.service'
import {map} from 'rxjs/operators'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {Category} from 'app/admin-pages/categories/categories.interface'
import {CategoriesStore} from 'app/@core/stores/categories.store'

@Injectable()
export class CategoriesApi {
  private readonly apiController: string = 'categories'

  constructor(private api: HttpService, protected categoriesStore: CategoriesStore) {}

  get categoriesDataSource(): DataSource {
    return this.api.getServerDataSource(`${this.api.apiUrl}/${this.apiController}`)
  }

  list(query: any = {}): Observable<Category[]> {
    const params = new HttpParams()

    return this.api.get(`${this.apiController}`, {params}).pipe(
      map((data: Category[]) => {
        this.categoriesStore.setCategories(data)
        return data
      })
    )
  }

  getCategories(): Observable<Category[]> {
    const categoriesCache = this.categoriesStore.getCategories()

    if (categoriesCache.length > 0) {
      return of(categoriesCache)
    }

    return this.api.get(`${this.apiController}`).pipe(
      map((data: Category[]) => {
        this.categoriesStore.setCategories(data)
        return data
      })
    )
  }

  get(id: string): Observable<any> {
    return this.api.get(`${this.apiController}/${id}`).pipe(
      map(data => {
        return data
      })
    )
  }

  delete(id: string): Observable<boolean> {
    return this.api.delete(`${this.apiController}/${id}`).pipe(
      map(data => {
        this.categoriesStore.removeCategory(id)
        return data
      })
    )
  }

  add(item: any): Observable<any> {
    return this.api.post(this.apiController, item)
  }

  update(item: any): Observable<any> {
    return this.api.put(`${this.apiController}/${item.id}`, item)
  }

  deleteSubCategory(categoryId: string, subCategoryId: string): Observable<boolean> {
    return this.api.delete(`${this.apiController}/${categoryId}/subcategories/${subCategoryId}`)
  }

  addSubCategory(categoryId: string, item: any): Observable<any> {
    return this.api.put(`${this.apiController}/${categoryId}/subcategories`, item)
  }

  updateSubCategory(categoryId: string, item: any): Observable<any> {
    return this.api.put(`${this.apiController}/${categoryId}/subcategories/${item.id}`, item)
  }
}
