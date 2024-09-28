/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Observable} from 'rxjs'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {Category, SubCategory} from '../categories/categories.interface'

export interface FlashCard {
  _id?: string
  id?: string
  title?: string
  uniqueIdentifier?: string
  category?: string | Category
  subCategory?: string | SubCategory
  description?: string
  importantDescription?: string
}

export abstract class FlashCardData {
  abstract get gridDataSource(): DataSource
  abstract list(pageNumber: number, pageSize: number): Observable<any[]>
  abstract get(id: string): Observable<any>
  abstract update(flashCard: any): Observable<any>
  abstract create(flashCard: any): Observable<any>
  abstract delete(id: string): Observable<boolean>
}
