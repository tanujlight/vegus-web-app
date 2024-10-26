import {V} from '@angular/cdk/keycodes'

export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users/list',
  CATEGORIES: '/admin/categories/list',
  QUESTIONS: '/admin/questions/list',
  CASE_STUDIES: '/admin/case-studies/list',
  EXAMS: '/admin/exams/list',
  ASSESMENTS: '/admin/assesments/list',
  FLASH_CARDS: '/admin/flash-cards/list',
  PLANS: '/admin/plans/list',
  STUDY_MATERIAL: {
    NOTES_LIST: '/admin/study-material/notes/list',
    VIDEOS_LIST: '/admin/study-material/videos/list'
  }
}

export const STUDENT_ROUTES = {
  DASHBOARD: '/student/dashboard',
  EXAMS: {
    LIST: '/student/exams/list',
    VIEW: '/student/exams/view'
  },
  REPORTS: {
    LIST: '/student/reports/list',
    VIEW: '/student/reports/view'
  },
  FLASH_CARDS: {
    LIST: '/student/flash-cards/list',
    VIEW: '/student/flash-cards/view'
  },
  STUDY_MATERIAL: {
    NOTES_LIST: '/student/study-material/notes/list',
    VIDEOS_LIST: '/student/study-material/videos/list'
  },
  TUTOR: {
    TESTS_NEW: '/student/tutor/tests/new',
    TESTS_LIST: '/student/tutor/tests/list',
    PERFORMANCE: '/student/tutor/performance'
  },
  PROFILE: '/student/profile'
}

export const WEBSITE_ROUTES = {
  HOME: '/',
  ABOUT_US: '/about-us',
  CONTACT_US: '/contact-us',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
  PRIVACY_POLICY: '/privacy-policy',
  REFUND_POLICY: '/refund-policy'
}

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  LOGOUT: '/auth/logout'
}
