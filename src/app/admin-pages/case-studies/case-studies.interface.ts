/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Observable} from 'rxjs'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {Question} from '../questions/questions.interface'

export interface CaseStudyTab {
  _id?: string
  id?: string
  title: string
  description?: string
}

export interface CaseStudy {
  _id?: string
  id?: string
  title: string
  category?: any
  subCategory?: any
  tabs: CaseStudyTab[]
  marks?: number
  questions: Question[]
}

export abstract class CaseStudyData {
  abstract get gridDataSource(): DataSource
  abstract list(pageNumber: number, pageSize: number): Observable<any[]>
  abstract get(id: string): Observable<any>
  abstract update(caseStudy: any): Observable<any>
  abstract create(caseStudy: any): Observable<any>
  abstract delete(id: string): Observable<boolean>
}
