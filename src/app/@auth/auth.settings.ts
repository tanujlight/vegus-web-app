/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {NbAuthOAuth2JWTToken, NbPasswordAuthStrategy} from '@nebular/auth'
import {environment} from '../../environments/environment'

export const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github'
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook'
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter'
  }
]

export const authOptions = {
  strategies: [
    NbPasswordAuthStrategy.setup({
      name: 'email',
      baseEndpoint: environment.apiUrl,
      token: {
        class: NbAuthOAuth2JWTToken,
        key: 'token'
      },
      login: {
        endpoint: '/auth/login',
        method: 'post'
      },
      register: {
        endpoint: '/auth/sign-up',
        method: 'post'
      },
      logout: {
        endpoint: '/auth/sign-out',
        method: 'post'
      },
      requestPass: {
        endpoint: '/auth/request-pass',
        method: 'post'
      },
      resetPass: {
        endpoint: '/auth/reset-pass',
        method: 'post',
        resetPasswordTokenKey: 'resetPasswordToken'
      },
      refreshToken: {
        endpoint: '/auth/refresh-token',
        method: 'post'
      }
    })
  ],
  forms: {
    login: {
      socialLinks: socialLinks,
      redirectDelay: 1000
    },
    register: {
      socialLinks: socialLinks,
      redirectDelay: 1000
    },
    requestPassword: {
      redirectDelay: 5000
    },
    resetPass: {
      redirectDelay: 2000
    },
    validation: {
      firstName: {
        required: true,
        minLength: 2,
        maxLength: 20
      },
      lastName: {
        required: true,
        minLength: 2,
        maxLength: 200
      }
    }
  }
}
