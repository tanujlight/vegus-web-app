/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {NB_AUTH_OPTIONS, NbAuthSocialLink, NbAuthService, NbAuthResult} from '@nebular/auth'
import {MyToastService} from 'app/services/my-toast.service'
import {NbThemeService} from '@nebular/theme'
import {getDeepFromObject} from '../../helpers'
import {EMAIL_PATTERN} from '../constants'

@Component({
  selector: 'ngx-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxRegisterComponent implements OnInit {
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
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected themeService: NbThemeService,
    private fb: FormBuilder,
    protected router: Router,
    private toastService: MyToastService
  ) {}

  get firstName() {
    return this.registerForm.get('firstName')
  }
  get lastName() {
    return this.registerForm.get('lastName')
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
  get terms() {
    return this.registerForm.get('terms')
  }

  ngOnInit(): void {
    const firstNameValidators = []
    this.isFirstNameRequired && firstNameValidators.push(Validators.required)

    const lastNameValidators = []
    this.isLastNameRequired && lastNameValidators.push(Validators.required)

    const emailValidators = [Validators.pattern(EMAIL_PATTERN)]
    this.isEmailRequired && emailValidators.push(Validators.required)

    const passwordValidators = [Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]
    this.isPasswordRequired && passwordValidators.push(Validators.required)

    this.registerForm = this.fb.group({
      firstName: this.fb.control('', [...firstNameValidators]),
      lastName: this.fb.control('', [...lastNameValidators]),
      email: this.fb.control('', [...emailValidators]),
      password: this.fb.control('', [...passwordValidators]),
      confirmPassword: this.fb.control('', [...passwordValidators]),
      terms: this.fb.control('')
    })
  }

  onEmailInput(e) {
    if (e.target.value.length > 0) {
      e.target.value = e.target.value.toLowerCase()
    }
  }

  register(): void {
    this.user = this.registerForm.value
    this.errors = this.messages = []
    this.submitted = true

    this.service.register(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false
      if (result.isSuccess()) {
        this.messages = result.getMessages()

        setTimeout(() => {
          this.toastService.showToast(`Registration successful. Let's wait for admin approval.`)
          return this.router.navigate(['auth/login'])
        }, this.redirectDelay)
      } else {
        this.errors = result.getErrors()
      }

      // const redirect = result.getRedirect()
      // if (redirect) {
      //   setTimeout(() => {
      //     return this.router.navigateByUrl(redirect)
      //   }, this.redirectDelay)
      // }
      this.cd.detectChanges()
    })
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null)
  }
}
