/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {NB_AUTH_OPTIONS, NbAuthSocialLink, NbAuthService, NbAuthResult} from '@nebular/auth'
import {MyToastService} from 'app/services/my-toast.service'
import {NbThemeService} from '@nebular/theme'
import {getDeepFromObject} from '../../helpers'
import {EMAIL_PATTERN, PHONE_PATTERN} from '../constants'
import {InitUserService} from '../../../@theme/services/init-user.service'
import {UserData} from '../../../@core/interfaces/common/users'

import {LoaderService} from 'app/services/loader.service'
import {NbDialogService} from '@nebular/theme'
import {OtpVerificationDialogComponent} from '../otp-verification-dialog/otp-verification-dialog.component'
import {PlansApi} from 'app/services/apis/plans.service'
import {COUNTRIES_LIST} from '../../../../assets/data/countries'

@Component({
  selector: 'ngx-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxRegisterComponent implements OnInit {
  countries = COUNTRIES_LIST
  plans = []

  selectedPlanId: string
  selectedPlan: any

  minLength: number = this.getConfigValue('forms.validation.password.minLength')
  maxLength: number = this.getConfigValue('forms.validation.password.maxLength')
  isFirstNameRequired: boolean = this.getConfigValue('forms.validation.firstName.required')
  isLastNameRequired: boolean = this.getConfigValue('forms.validation.lastName.required')
  isEmailRequired: boolean = this.getConfigValue('forms.validation.email.required')
  isPasswordRequired: boolean = this.getConfigValue('forms.validation.password.required')
  redirectDelay: number = this.getConfigValue('forms.register.redirectDelay')
  showMessages: any = this.getConfigValue('forms.register.showMessages')
  strategy: string = this.getConfigValue('forms.register.strategy')
  socialLinks: NbAuthSocialLink[] = this.getConfigValue('forms.login.socialLinks')

  submitted = false
  errors: string[] = []
  messages: string[] = []
  user: any = {}

  registerForm: FormGroup

  constructor(
    protected service: NbAuthService,
    private usersService: UserData,
    private dialogService: NbDialogService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected themeService: NbThemeService,
    private fb: FormBuilder,
    protected router: Router,
    private loaderService: LoaderService,
    private toastService: MyToastService,
    private route: ActivatedRoute,
    private plansApi: PlansApi,
    protected initUserService: InitUserService
  ) {}

  get firstName() {
    return this.registerForm.get('firstName')
  }
  get lastName() {
    return this.registerForm.get('lastName')
  }
  get phone() {
    return this.registerForm.get('phone')
  }

  get email() {
    return this.registerForm.get('email')
  }
  get password() {
    return this.registerForm.get('password')
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword')
  }
  get street() {
    return this.registerForm.get('address').get('street')
  }

  get city() {
    return this.registerForm.get('address').get('city')
  }

  get state() {
    return this.registerForm.get('address').get('state')
  }

  get zipCode() {
    return this.registerForm.get('address').get('zipCode')
  }

  get country() {
    return this.registerForm.get('address').get('country')
  }

  get terms() {
    return this.registerForm.get('terms')
  }

  get alreadyClassEnrolled() {
    return this.registerForm.get('alreadyClassEnrolled')
  }

  async ngOnInit() {
    await this.syncQueryParams()

    if (this.selectedPlanId) {
      this.getPlans()
    }

    const firstNameValidators = []
    this.isFirstNameRequired && firstNameValidators.push(Validators.required)

    const lastNameValidators = []
    this.isLastNameRequired && lastNameValidators.push(Validators.required)

    const emailValidators = [Validators.pattern(EMAIL_PATTERN)]
    if (this.isEmailRequired) {
      emailValidators.push(Validators.required)
    }

    const passwordValidators = [Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]
    if (this.isPasswordRequired) {
      passwordValidators.push(Validators.required)
    }

    this.registerForm = this.fb.group({
      firstName: this.fb.control('', [...firstNameValidators]),
      lastName: this.fb.control('', [...lastNameValidators]),
      phone: this.fb.control('', [Validators.pattern(PHONE_PATTERN)]),
      email: this.fb.control('', [...emailValidators]),
      password: this.fb.control('', [...passwordValidators]),
      confirmPassword: this.fb.control('', [...passwordValidators]),
      terms: this.fb.control(''),
      alreadyClassEnrolled: this.fb.control(this.selectedPlanId ? false : true),
      address: this.fb.group({
        street: this.fb.control(''),
        city: this.fb.control(''),
        state: this.fb.control(''),
        country: this.fb.control('', [Validators.required]),
        zipCode: this.fb.control('')
      })
    })
  }

  private async syncQueryParams() {
    return new Promise(resolve => {
      this.route.queryParams.subscribe(params => {
        this.selectedPlanId = params['plan'] || ''
        resolve(true)
      })
    })
  }

  onEmailInput(e) {
    if (e.target.value.length > 0) {
      e.target.value = e.target.value.toLowerCase()
    }
  }

  submit() {
    if (this.registerForm.invalid) {
      return
    }

    if (this.password.value !== this.confirmPassword.value) {
      this.toastService.showToast('Passwords do not match', 'Error', 'danger')
      return
    }

    if (!this.terms.value) {
      this.toastService.showToast('Please accept the terms and conditions', 'Error', 'danger')
      return
    }

    this.initiateOtpVerification()
  }

  private initiateOtpVerification() {
    this.usersService.generateOTP(this.email.value).subscribe({
      next: response => {
        this.openOtpDialog()
      },
      error: error => {
        console.error('Error generating OTP:', error)
        this.toastService.showToast('Error generating OTP. Please try again.', 'Error', 'danger')
      }
    })
  }

  openOtpDialog() {
    const dialogRef = this.dialogService.open(OtpVerificationDialogComponent, {
      context: {
        email: this.email.value
      },
      closeOnBackdropClick: false,
      closeOnEsc: false
    })

    dialogRef.onClose.subscribe(result => {
      if (result === 'yes') {
        this.register()
      }
    })
  }

  register(): void {
    this.user = this.registerForm.value
    this.errors = this.messages = []
    this.submitted = true

    this.user.role = !this.user.alreadyClassEnrolled ? 'subscriber' : 'user'

    this.service.register(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false
      if (result.isSuccess()) {
        this.messages = result.getMessages()

        if (this.user.role === 'user') {
          setTimeout(() => {
            this.toastService.showToast(
              `Registration successful. Let's wait for admin approval.`,
              'Welcome',
              'success',
              10000
            )
            return this.router.navigate(['auth/login'])
          }, this.redirectDelay)
        } else {
          this.initUserService.initCurrentUser().subscribe((data: any) => {
            if (this.selectedPlanId) {
              this.buyPlan(this.selectedPlan)
              return
            } else {
              this.router.navigate(['student/subscription/plans'])
            }
          })
        }
      } else {
        this.errors = result.getErrors()
      }

      this.cd.detectChanges()
    })
  }

  buyPlan(plan) {
    let via = 'stripe'

    if (this.user.address.country === 'India') {
      via = 'razorpay'
    }

    this.plansApi.initializePayment({planId: plan.id, via: via}).subscribe(data => {
      if (via === 'razorpay') {
        // Redirect the user to the Razorpay Checkout page
        window.location.href = data.paymentLink.short_url
      } else if (via === 'stripe') {
        // Redirect the user to the Stripe Checkout page
        window.location.href = data.url
      }
    })
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null)
  }

  private getPlans() {
    const query = {
      type: 'subscription'
    }

    this.plansApi.list(query).subscribe((plans: any[]) => {
      this.plans = plans.map(p => {
        p.hasDiscount = false

        if (p.discount) {
          p.hasDiscount = true
          const discountAmount = (p.discount / 100) * p.price

          p.finalPrice = p.price - discountAmount
        }

        return p
      })

      this.selectedPlan = this.plans.find(p => p._id === this.selectedPlanId)

      this.cd.detectChanges()
    })
  }

  private setShowLoaderToTrue() {
    setTimeout(() => {
      this.loaderService.showLoader.next(true)
    }, 200)
  }
}
