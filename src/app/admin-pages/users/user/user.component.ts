/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, OnDestroy, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Router, ActivatedRoute} from '@angular/router'
import {Location} from '@angular/common'
import * as moment from 'moment'
import {Observable, Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'

import {NbToastrService} from '@nebular/theme'

import {UserData, User} from '../../../@core/interfaces/common/users'
import {EMAIL_PATTERN, COUNTRY_CODE_PATTERN, PHONE_PATTERN} from '../../../@auth/components'
import {NbAuthOAuth2JWTToken, NbTokenService} from '@nebular/auth'
import {UserStore} from '../../../@core/stores/user.store'

export enum UserFormMode {
  VIEW = 'View',
  EDIT = 'Edit',
  ADD = 'Add',
  EDIT_SELF = 'EditSelf'
}

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  user: User

  isSubscriptionActive: boolean = false

  rolesList = [
    {
      name: 'Student',
      value: 'user'
    }
  ]

  statusList = [
    {
      name: 'Active',
      value: 'active'
    },
    {
      name: 'In Active',
      value: 'inactive'
    }
  ]
  userForm: FormGroup

  protected readonly unsubscribe$ = new Subject<void>()

  get role() {
    return this.userForm.get('role')
  }

  get status() {
    return this.userForm.get('status')
  }

  get firstName() {
    return this.userForm.get('firstName')
  }

  get lastName() {
    return this.userForm.get('lastName')
  }

  get email() {
    return this.userForm.get('email')
  }

  get phone() {
    return this.userForm.get('phone')
  }

  get countryCode() {
    return this.userForm.get('countryCode')
  }

  get whatsappPhone() {
    return this.userForm.get('whatsappPhone')
  }

  get dateOfEnrollment() {
    return this.userForm.get('dateOfEnrollment')
  }

  get dob() {
    return this.userForm.get('dob')
  }

  get street() {
    return this.userForm.get('address').get('street')
  }

  get city() {
    return this.userForm.get('address').get('city')
  }

  get state() {
    return this.userForm.get('address').get('state')
  }

  get zipCode() {
    return this.userForm.get('address').get('zipCode')
  }

  get country() {
    return this.userForm.get('address').get('country')
  }

  mode: UserFormMode
  setViewMode(viewMode: UserFormMode) {
    this.mode = viewMode
  }

  constructor(
    private usersService: UserData,
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: NbTokenService,
    private userStore: UserStore,
    private toasterService: NbToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initUserForm()
    this.loadUserData()
  }

  initUserForm() {
    this.userForm = this.fb.group({
      id: this.fb.control(''),
      uniqueIdentifier: this.fb.control(''),
      role: this.fb.control('user', [Validators.required]),
      status: this.fb.control('active', [Validators.required]),
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      dob: this.fb.control(null, []),
      dateOfEnrollment: this.fb.control(null, []),
      email: this.fb.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      phone: this.fb.control('', [Validators.pattern(PHONE_PATTERN)]),
      whatsappPhone: this.fb.control('', [Validators.pattern(PHONE_PATTERN)]),
      countryCode: this.fb.control('', [Validators.pattern(COUNTRY_CODE_PATTERN)]),
      address: this.fb.group({
        street: this.fb.control(''),
        city: this.fb.control(''),
        state: this.fb.control(''),
        country: this.fb.control(''),
        zipCode: this.fb.control('')
      })
    })
  }

  get canEdit(): boolean {
    return this.mode !== UserFormMode.VIEW
  }

  loadUserData() {
    const id = this.route.snapshot.paramMap.get('id')
    const isProfile = this.route.snapshot.queryParamMap.get('profile')
    if (isProfile) {
      this.setViewMode(UserFormMode.EDIT_SELF)
      this.loadUser()
    } else {
      if (id) {
        const currentUserId = this.userStore.getUser().id
        this.setViewMode(currentUserId.toString() === id ? UserFormMode.EDIT_SELF : UserFormMode.EDIT)
        this.loadUser(id)
      } else {
        this.setViewMode(UserFormMode.ADD)
      }
    }
  }

  loadUser(id?) {
    const loadUser =
      this.mode === UserFormMode.EDIT_SELF ? this.usersService.getCurrentUser() : this.usersService.get(id)
    loadUser.pipe(takeUntil(this.unsubscribe$)).subscribe((user: any) => {
      this.user = user
      this.checkSubscriptionActive()

      this.userForm.setValue({
        id: user.id || '',
        uniqueIdentifier: user.uniqueIdentifier || '',
        role: user.role || 'user',
        status: user.status || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dob: (user.dob && moment(user.dob).toDate()) || null,
        dateOfEnrollment: (user.dateOfEnrollment && moment(user.dateOfEnrollment).toDate()) || null,
        countryCode: user.countryCode || '',
        whatsappPhone: user.whatsappPhone || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address && user.address.street ? user.address.street : '',
          city: user.address && user.address.city ? user.address.city : '',
          state: user.address && user.address.state ? user.address.state : '',
          country: user.address && user.address.country ? user.address.country : '',
          zipCode: user.address && user.address.zipCode ? user.address.zipCode : ''
        }
      })

      // this is a place for value changes handling
      // this.userForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {   });
    })
  }

  onEmailInput(e) {
    if (e.target.value.length > 0) {
      e.target.value = e.target.value.toLowerCase()
    }
  }

  convertToUser(value: any): User {
    const user: User = value
    return user
  }

  save() {
    const user: User = this.convertToUser(this.userForm.value)

    let observable = new Observable<User>()
    if (this.mode === UserFormMode.EDIT_SELF) {
      this.usersService.updateCurrent(user).subscribe(
        (result: any) => {
          this.tokenService.set(new NbAuthOAuth2JWTToken(result, 'email', new Date()))
          this.handleSuccessResponse()
        },
        err => {
          this.handleWrongResponse()
        }
      )
    } else {
      observable = user.id ? this.usersService.update(user) : this.usersService.create(user)
    }

    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(
      () => {
        this.handleSuccessResponse()
      },
      err => {
        this.handleWrongResponse()
      }
    )
  }

  checkSubscriptionActive(): void {
    if (this.user.subscription && this.user.subscription.endDate) {
      const currentDate = new Date()
      const endDate = new Date(this.user.subscription.endDate)

      // Check if endDate is in the future or today
      this.isSubscriptionActive = endDate >= currentDate
    }
  }

  handleSuccessResponse() {
    let message = ''
    switch (this.mode) {
      case UserFormMode.ADD:
        message = 'User created!'
        break
      case UserFormMode.EDIT:
        message = 'User updated!'
        break
      case UserFormMode.EDIT_SELF:
        message = 'Profile updated!'
        break
      default:
        message = 'User updated!'
    }
    this.toasterService.success('', message)
    this.back()
  }

  handleWrongResponse() {
    // this.toasterService.danger('', `This email has already taken!`)
  }

  back() {
    this._location.back()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
