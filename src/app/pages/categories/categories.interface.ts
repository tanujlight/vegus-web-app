/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Observable} from 'rxjs'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'

export interface SubCategory {
  _id?: string
  id?: string
  name: string
  description?: string
  isActive: boolean
}

export interface Category {
  _id?: string
  id?: string
  name: string
  description?: string
  subCategories: SubCategory[]
  isActive: boolean
  createdAt?: Date | String
}

export abstract class CategoryData {
  abstract get gridDataSource(): DataSource
  abstract list(pageNumber: number, pageSize: number): Observable<Category[]>
  abstract get(id: string): Observable<Category>
  abstract update(category: Category): Observable<Category>
  abstract create(category: Category): Observable<Category>
  abstract delete(id: string): Observable<boolean>
}
