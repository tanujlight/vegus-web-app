/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

export const EMAIL_PATTERN = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
export const PHONE_PATTERN = /^\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
export const NUMBERS_PATTERN = '^-?[0-9]+$'
export const COUNTRY_CODE_PATTERN = /^(\+[1-9]\d{0,2})$/ // +1, +12, +123
export const DOUBLE_PATTERN = '[+-]?([0-9]*[.])?[0-9]+'
