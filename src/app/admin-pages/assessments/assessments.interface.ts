/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Observable} from 'rxjs'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {Question} from '../questions/questions.interface'
import {CaseStudy} from '../case-studies/case-studies.interface'

export interface Assessment {
  _id?: string
  id?: string
  title: string
  totalMarks: number
  // status: ExamStatus
  type: ExamType
  // timeLimit?: number
  // startDate: Date
  // endDate: Date
  specialInstructions?: string
  questionsAndCaseStudies: QuestionAndCaseStudy[]
}

export interface QuestionAndCaseStudy {
  _id?: string
  id?: string
  type: 'question' | 'caseStudy'
  question?: Question
  caseStudy?: CaseStudy
}

export enum ExamStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ExamType {
  TUTORIAL = 'tutorial',
  TIME_BASED = 'time-based'
}

export interface IExamStatusListWithTitle {
  value: ExamStatus
  title: string
}

export const AssessmentStatusListWithTitle = [
  {
    value: ExamStatus.DRAFT,
    title: 'Draft'
  },
  {
    value: ExamStatus.SCHEDULED,
    title: 'Scheduled'
  },
  {
    value: ExamStatus.PUBLISHED,
    title: 'Published'
  },
  {
    value: ExamStatus.COMPLETED,
    title: 'Completed'
  },
  {
    value: ExamStatus.CANCELLED,
    title: 'Cancelled'
  }
]

export abstract class ExamData {
  abstract get gridDataSource(): DataSource
  abstract list(pageNumber: number, pageSize: number): Observable<any[]>
  abstract get(id: string): Observable<any>
  abstract update(exam: any): Observable<any>
  abstract create(exam: any): Observable<any>
  abstract delete(id: string): Observable<boolean>
}
