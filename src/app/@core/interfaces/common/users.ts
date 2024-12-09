/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Observable} from 'rxjs'
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source'
import {Settings} from './settings'

export interface User {
  id: string | number
  role: string
  status: string
  profileImage?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  countryCode?: string
  whatsappPhone?: string
  dateOfEnrollment?: Date
  classDetails?: {
    startDate: Date
    endDate: Date
    assessmentsEnabled: boolean
  }
  name?: string
  dob?: Date
  login: string
  picture: string
  address: Address
  settings: Settings
  subscription?: any
  paymentDetails?: any
}

export enum UserTypeEnum {
  Class = 'user',
  Subscriber = 'subscriber'
}

export interface Address {
  street: string
  state?: string
  city: string
  zipCode: string
  landmark?: string
  country?: string
}

export abstract class UserData {
  abstract get gridDataSource(): DataSource
  abstract getCurrentUser(): Observable<User>
  abstract list(pageNumber: number, pageSize: number): Observable<User[]>
  abstract get(id: number): Observable<User>
  abstract getDashboardData(): Observable<any>
  abstract generateOTP(email: string): Observable<any>
  abstract verifyOTP(email: string, otp: string): Observable<any>
  abstract update(user: User): Observable<User>
  abstract updateProfileImage(id: string | number, file: File): Observable<User>
  abstract updateStatus(id: string, status: string): Observable<User>
  abstract updateCurrent(user: User): Observable<User>
  abstract create(user: User): Observable<User>
  abstract delete(id: number): Observable<boolean>
}
